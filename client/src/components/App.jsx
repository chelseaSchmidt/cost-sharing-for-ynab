/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import TransactionWindow from './TransactionWindow';
import AccountSelector from './AccountSelector';
import {
  getCCTransactions,
  getDTFTransactions,
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

const App = (props) => {
  const [user, setUser] = useState(null);
  const [sinceDate, setSinceDate] = useState(getFiveDaysAgo());
  const [endDate, setEndDate] = useState(new Date());
  const [checkedTransactions, setCheckedTransactions] = useState([]);
  const [splitDate, setSplitDate] = useState(new Date());
  const [transactions, setTransactions] = useState({
    ccTransactions: [],
    dueToFromTransactions: [],
  });
  const [userData, setUserData] = useState({
    sharedAccounts: [],
    sharedCategories: [],
  });

  useEffect(() => {
    getTransactions();
  }, [props]);

  useEffect(() => {
    if (user) {
      getUserData(user)
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    }
    // get user accounts from YNAB
    // get user budget categories from YNAB
    // cross reference with stored user data from this app's database
    // pass props down to <AccountSelector />
    // <AccountSelector /> should show saved selections (GET) & allow new selections (PATCH)
  }, [user]);

  function getTransactions(e = { preventDefault: () => {} }) {
    e.preventDefault();
    const newTxns = {
      ccTransactions: [],
      dueToFromTransactions: [],
    };
    getCCTransactions(sinceDate)
      .then(({ data: { data } }) => {
        newTxns.ccTransactions = data.transactions.filter((txn) => (
          checkIfDateInRange(txn.date, endDate) && txn.approved && !txn.transfer_account_id
        ));
        return getDTFTransactions(sinceDate);
      })
      .then(({ data: { data } }) => {
        newTxns.dueToFromTransactions = data.transactions.filter((txn) => (
          checkIfDateInRange(txn.date, endDate) && txn.approved && !txn.transfer_account_id
        ));
        setTransactions(newTxns);
      })
      .catch((err) => { console.error(err); });
  }

  function handleSelectTransaction({ target: { checked } }, transaction) {
    if (checked) {
      setCheckedTransactions((prevTxns) => {
        const newTxns = [...prevTxns];
        newTxns.push(transaction);
        return newTxns;
      });
    } else {
      setCheckedTransactions((prevTxns) => {
        const newTxns = [...prevTxns];
        const deletionIndex = newTxns.reduce((finalIdx, txn, currIdx) => (
          txn.id === transaction.id ? currIdx : finalIdx
        ), null);
        newTxns.splice(deletionIndex, 1);
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

  if (!user) {
    const requestUsername = () => {
      const username = prompt('Please enter your username');
      if (!username) {
        return requestUsername();
      }
      if (username.length === 0) {
        return requestUsername();
      } else {
        setUser(username);
      }
    };
    requestUsername();
  }

  return (
    <div>
      <AccountSelector username={user} />
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
            title="Credit Card Account"
            transactions={transactions.ccTransactions}
            handleSelectTransaction={handleSelectTransaction}
          />
        </div>
        <div>
          <TransactionWindow
            title="Due To/From Account"
            transactions={transactions.dueToFromTransactions}
            handleSelectTransaction={handleSelectTransaction}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
