/* eslint-disable no-param-reassign, camelcase */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import TransactionWindow from './TransactionWindow';
import AccountSelector from './AccountSelector';
import {
  getAllTransactions,
  getDTFTransactions,
  getAccounts,
  getCategories,
  createSplitTransaction,
  getUserData,
} from '../../utilities/http';
import {
  getFiveDaysAgo,
  convertDateToString,
  convertStringToDate,
  checkIfDateInRange,
} from '../../utilities/dateHelpers';
import { dueToFromId } from '../../../identifiers';
import '../styles/App.css';

const App = () => {
  const [user, setUser] = useState('');
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
    dueToFromTransactions: [],
  });
  const [userData, setUserData] = useState({
    sharedAccounts: [],
    sharedCategories: [],
    budgetAccounts: [{ name: '', id: '' }],
    budgetCategories: [{ name: '', id: '' }],
  });

  useEffect(() => {
    getTransactions();
  }, [userData]);

  useEffect(() => {
    if (user.length) {
      const userObj = {
        sharedAccounts: [],
        sharedCategories: [],
        budgetAccounts: [],
        budgetCategories: [],
      };
      getUserData(user)
        .then(({ data }) => {
          if (data.length > 0) {
            userObj.sharedAccounts = data[0].sharedAccounts;
            userObj.sharedCategories = data[0].sharedCategories;
          }
          return getAccounts();
        })
        .then(({ data: { data: { accounts } } }) => {
          userObj.budgetAccounts = accounts
            .filter(({ closed }) => !closed)
            .map(({ name, id }) => { return { name, id }; }); // eslint-disable-line
          return getCategories();
        })
        .then(({ data: { data: { category_groups } } }) => {
          userObj.budgetCategories = _.flatten(category_groups
            .filter(({ hidden }) => !hidden)
            .map(({ categories }) => categories
              .filter(({ hidden }) => !hidden)
              .map(({ name, id }) => { return { name, id }; })) // eslint-disable-line
          );
          setUserData(userObj);
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  function getTransactions(e = { preventDefault: () => {} }) {
    e.preventDefault();
    const newTxns = {
      bankTransactions: [],
      catTransactions: [],
      isolatedTransactions: [],
      dueToFromTransactions: [],
    };
    const sharedAccountIds = userData.sharedAccounts.map((acct) => acct.accountId);
    const sharedCatIds = userData.sharedCategories.map((cat) => cat.categoryId);
    getAllTransactions(sinceDate)
      .then(({ data: { data } }) => {
        data.transactions.filter((txn) => (
          checkIfDateInRange(txn.date, endDate)
          && txn.approved
          && !txn.transfer_account_id
        )).forEach((txn) => {
          let count = 0;
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
        return getDTFTransactions(sinceDate);
      })
      .then(({ data: { data } }) => {
        newTxns.dueToFromTransactions = data.transactions.filter((txn) => (
          checkIfDateInRange(txn.date, endDate)
          && txn.approved
          && !txn.transfer_account_id
        ));
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
    const halvedCostsByCategory = checkedTransactions.reduce((totals, txn) => {
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
      account_id: dueToFromId,
      date: convertDateToString(splitDate),
      amount: _.reduce(halvedCostsByCategory, (sum, amt) => sum + amt) * 1000,
      payee_id: null,
      payee_name: null,
      category_id: null,
      memo: null,
      cleared: 'uncleared',
      approved: true,
      flag_color: null,
      import_id: null,
      subtransactions: _.map(halvedCostsByCategory, (amt, catId) => ({
        amount: amt * 1000,
        payee_id: null,
        payee_name: 'Shared Costs',
        category_id: catId,
        memo: null,
      })),
    };
    createSplitTransaction(summaryTransaction)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  const transactionsAreSelected = checkedTransactions.length > 0;

  if (!user.length) {
    const requestUsername = () => {
      const username = prompt('Please enter your username');
      if (!username) {
        return requestUsername();
      }
      if (username.length === 0) {
        return requestUsername();
      }
      setUser(username);
    };
    requestUsername();
  }

  return (
    <div>
      <AccountSelector
        userData={userData}
        setUserData={setUserData}
        username={user}
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
        <div>
          <TransactionWindow
            title="Transactions in Shared Categories"
            transactions={transactions.catTransactions}
            isolatedTransactions={transactions.isolatedTransactions}
            checkmarks={checkedTransactions.checkmarks}
            handleSelectTransaction={handleSelectTransaction}
            selectAll={selectAll}
          />
        </div>
        <div>
          <TransactionWindow
            title="Transactions in Shared Banking Accounts"
            transactions={transactions.bankTransactions}
            isolatedTransactions={transactions.isolatedTransactions}
            handleSelectTransaction={handleSelectTransaction}
          />
        </div>
        <div>
          <TransactionWindow
            title="Due To/From Account"
            transactions={transactions.dueToFromTransactions}
            isolatedTransactions={transactions.isolatedTransactions}
            handleSelectTransaction={handleSelectTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
