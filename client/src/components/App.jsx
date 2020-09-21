/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import TransactionWindow from './TransactionWindow';
import {
  getCCTransactions,
  getDTFTransactions,
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
  const [transactions, setTransactions] = useState({
    ccTransactions: [],
    dueToFromTransactions: [],
  });
  const [checkedTransactions, setCheckedTransactions] = useState([]);
  const [splitDate, setSplitDate] = useState(new Date());

  useEffect(() => {
    let ccTransactions = [];

    getCCTransactions(sinceDate)
      .then(({ data: { data } }) => {
        ccTransactions = data.transactions.filter((txn) => (
          checkIfDateInRange(txn.date, endDate) && txn.approved && !txn.transfer_account_id
        ));
        return getDTFTransactions(sinceDate);
      })
      .then(({ data: { data } }) => {
        const dueToFromTransactions = data.transactions.filter((txn) => (
          checkIfDateInRange(txn.date, endDate) && txn.approved && !txn.transfer_account_id
        ));
        setTransactions({
          ccTransactions,
          dueToFromTransactions,
        });
      })
      .catch((err) => { console.error(err); });
  }, [props]);

  function handleDateInput({ target: { id, value } }) {
    if (id === 'start') {
      setSinceDate(convertStringToDate(value));
    } else {
      setEndDate(convertStringToDate(value, false));
    }
  }

  function handleDateSubmit(e) {
    e.preventDefault();
    let ccTransactions = [];

    getCCTransactions(sinceDate)
      .then(({ data: { data } }) => {
        ccTransactions = data.transactions.filter((txn) => (
          checkIfDateInRange(txn.date, endDate) && txn.approved && !txn.transfer_account_id
        ));
        return getDTFTransactions(sinceDate);
      })
      .then(({ data: { data } }) => {
        const dueToFromTransactions = data.transactions.filter((txn) => (
          checkIfDateInRange(txn.date, endDate) && txn.approved && !txn.transfer_account_id
        ));
        setTransactions({
          ccTransactions,
          dueToFromTransactions,
        });
      })
      .catch((err) => { console.error(err); });
  }

  function handleSplitDateInput({ target: { value } }) {
    setSplitDate(convertStringToDate(value));
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

  const transactionsSelected = checkedTransactions.length > 0;

  return (
    <div>
      <form>
        <label htmlFor="start">
          Specify start date:
          <input
            type="date"
            id="start"
            value={convertDateToString(sinceDate)}
            onChange={handleDateInput}
          />
        </label>
        <label htmlFor="start">
          Specify end date:
          <input
            type="date"
            id="end"
            value={convertDateToString(endDate)}
            onChange={handleDateInput}
          />
        </label>
        <button type="submit" onClick={handleDateSubmit}>Update Transactions</button>
      </form>
      {
        transactionsSelected
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
                onChange={handleSplitDateInput}
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
