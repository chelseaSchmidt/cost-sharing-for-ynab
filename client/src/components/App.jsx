/* eslint-disable no-param-reassign, camelcase */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import TransactionWindow from './TransactionWindow';
import AccountSelector from './AccountSelector';
import {
  getAllTransactions,
  getAccounts,
  getCategories,
  createSplitTransaction,
} from '../../utilities/http';
import {
  getFiveDaysAgo,
  convertDateToString,
  convertStringToDate,
  checkIfDateInRange,
} from '../../utilities/dateHelpers';
import { dueToFromId } from '../../../identifiers';
import '../styles/App.css';

const App = (props) => {
  const [sinceDate, setSinceDate] = useState(getFiveDaysAgo());
  const [endDate, setEndDate] = useState(new Date());
  const [checkedTransactions, setCheckedTransactions] = useState({
    transactions: [],
    checkmarks: [],
  });
  const [splitDate, setSplitDate] = useState(new Date());
  const [transactions, setTransactions] = useState({
    bankTransactions: [],
    catTransactions: [],
    isolatedTransactions: [],
    recipientTransactions: [],
  });
  const [budgetData, setBudgetData] = useState({
    budgetAccounts: [{ name: '', id: '' }],
    budgetCategories: [{ name: '', id: '' }],
  });
  const [userData, setUserData] = useState({
    sharedAccounts: [],
    sharedCategories: [],
    splitAccount: '',
  });

  useEffect(() => {
    getTransactions();
  }, [userData]);

  useEffect(() => {
    const budgetObj = {
      budgetAccounts: [],
      budgetCategories: [],
    };
    getAccounts()
      .then(({ data: { data: { accounts } } }) => {
        budgetObj.budgetAccounts = accounts
          .filter(({ closed }) => !closed)
          .map(({ name, id }) => { return { name, id }; }); // eslint-disable-line
        return getCategories();
      })
      .then(({ data: { data: { category_groups } } }) => {
        budgetObj.budgetCategories = _.flatten(category_groups
          .filter(({ hidden }) => !hidden)
          .map(({ name, id, categories }) => { return { name, id, categories }; })); // eslint-disable-line
        setBudgetData(budgetObj);
      })
      .catch((err) => console.error(err));
  }, [props]);

  function getTransactions(e = { preventDefault: () => {} }) {
    e.preventDefault();
    const newTxns = {
      bankTransactions: [],
      catTransactions: [],
      isolatedTransactions: [],
      recipientTransactions: [],
    };
    const sharedAccountIds = userData.sharedAccounts.map((acct) => acct.accountId);
    const sharedCatIds = _.flatten(userData.sharedCategories
      .map((catGroup) => catGroup.subCategories))
      .map((cat) => cat.id);
    getAllTransactions(sinceDate)
      .then(({ data: { data } }) => {
        data.transactions.filter((txn) => (
          checkIfDateInRange(txn.date, endDate)
          && txn.approved
          && !txn.transfer_account_id
        )).forEach((txn) => {
          let count = 0;
          if (userData.splitAccount === txn.account_id) {
            newTxns.recipientTransactions.push(txn);
          }
          if (sharedAccountIds.indexOf(txn.account_id) > -1) {
            newTxns.bankTransactions.push(txn);
            count += 1;
          }
          if (sharedCatIds.indexOf(txn.category_id) > -1) {
            newTxns.catTransactions.push(txn);
            count += 1;
          }
          if (count === 1) {
            newTxns.isolatedTransactions.push(txn);
          }
        });
        setTransactions(newTxns);
      })
      .catch((err) => { console.error(err); });
  }

  function handleSelectTransaction({ target: { checked } }, transaction, txnNumber) {
    if (checked) {
      setCheckedTransactions((prevTxns) => {
        const newTxns = { ...prevTxns };
        newTxns.transactions.push(transaction);
        newTxns.checkmarks[txnNumber] = 1;
        return newTxns;
      });
    } else {
      setCheckedTransactions((prevTxns) => {
        const newTxns = { ...prevTxns };
        const deletionIndex = newTxns.transactions.reduce((finalIdx, txn, currIdx) => (
          txn.id === transaction.id ? currIdx : finalIdx
        ), null);
        newTxns.transactions.splice(deletionIndex, 1);
        newTxns.checkmarks[txnNumber] = 0;
        return newTxns;
      });
    }
  }

  function selectAll({ target: { checked } }) {
    if (checked) {
      setCheckedTransactions((prevTxns) => {
        const newTxns = { ...prevTxns };
        newTxns.transactions = [...transactions.catTransactions];
        newTxns.checkmarks = _.range(1, newTxns.transactions.length + 1, 0);
        return newTxns;
      });
    } else {
      setCheckedTransactions((prevTxns) => {
        const newTxns = { ...prevTxns };
        newTxns.transactions = [];
        newTxns.checkmarks = [];
        return newTxns;
      });
    }
  }

  function createSplitEntry(e) {
    e.preventDefault();
    const halvedCostsByCategory = checkedTransactions.transactions.reduce((totals, txn) => {
      if (txn.category_id in totals) {
        totals[txn.category_id] += Number((txn.amount / 1000 / 2).toFixed(2));
      } else {
        totals[txn.category_id] = Number((txn.amount / 1000 / 2).toFixed(2));
      }
      return totals;
    }, {});
    _.each(halvedCostsByCategory, (val, key) => {
      halvedCostsByCategory[key] = Number(val.toFixed(2));
      // TO DO: why is this conversion needed a second time?
    });
    const summaryTransaction = {
      account_id: userData.splitAccount,
      date: convertDateToString(splitDate),
      amount: Number(
        (_.reduce(halvedCostsByCategory, (sum, amt) => sum + amt) * 1000)
          .toFixed(2)
      ) * -1,
      payee_id: null,
      payee_name: null,
      category_id: null,
      memo: null,
      cleared: 'uncleared',
      approved: true,
      flag_color: null,
      import_id: null,
      subtransactions: _.map(halvedCostsByCategory, (amt, catId) => ({
        amount: amt * -1000,
        payee_id: null,
        payee_name: 'Shared Costs',
        category_id: catId,
        memo: null,
      })),
    };
    createSplitTransaction(summaryTransaction)
      .then(getTransactions)
      .catch((err) => console.error(err));
  }

  const transactionsAreSelected = checkedTransactions.transactions.length > 0;

  return (
    <div>
      <AccountSelector
        userData={userData}
        budgetData={budgetData}
        setUserData={setUserData}
      />
      <form>
        <label htmlFor="start">
          Specify start date:
          <input
            type="date"
            id="start"
            value={convertDateToString(sinceDate)}
            onChange={(e) => setSinceDate(convertStringToDate(e.target.value))}
          />
        </label>
        <label htmlFor="start">
          Specify end date:
          <input
            type="date"
            id="end"
            value={convertDateToString(endDate)}
            onChange={(e) => setEndDate(convertStringToDate(e.target.value, false))}
          />
        </label>
        <button type="submit" onClick={getTransactions}>Update Transactions</button>
      </form>
      {
        transactionsAreSelected
        && (
          <div>
            <form>
              <button type="submit" onClick={createSplitEntry}>
                Split Selected Transactions On Date
              </button>
              <input
                type="date"
                id="split-date"
                value={convertDateToString(splitDate)}
                onChange={(e) => setSplitDate(convertStringToDate(e.target.value))}
              />
            </form>
          </div>
        )
      }
      <div id="transaction-area">
        <TransactionWindow
          title="Transactions in Shared Categories"
          transactions={transactions.catTransactions}
          isolatedTransactions={transactions.isolatedTransactions}
          checkmarks={checkedTransactions.checkmarks}
          handleSelectTransaction={handleSelectTransaction}
          selectAll={selectAll}
        />
        <TransactionWindow
          title="Transactions in Shared Banking Accounts"
          transactions={transactions.bankTransactions}
          isolatedTransactions={transactions.isolatedTransactions}
          handleSelectTransaction={handleSelectTransaction}
        />
        <TransactionWindow
          title="Account Receiving Split Transaction"
          transactions={transactions.recipientTransactions}
          isolatedTransactions={transactions.isolatedTransactions}
          handleSelectTransaction={handleSelectTransaction}
        />
      </div>
    </div>
  );
};

export default App;
