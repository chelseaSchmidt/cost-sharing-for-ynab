/* eslint-disable no-param-reassign, camelcase */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import TransactionWindow from './TransactionWindow';
import AccountSelector from './AccountSelector';
import Confirmation from './Confirmation';
import PrivacyWindow from './PrivacyWindow';
import Header from './Header';
import Nav from './Nav';
import Error from './Error';
import {
  getTransactionsSinceDate,
  getAccounts,
  getCategoryGroups,
  createSplitTransaction,
} from './utils/http';
import {
  getFiveDaysAgo,
  convertDateToString,
  convertStringToDate,
  isDateBeforeEndDate,
} from './utils/dateHelpers';
import classifyTransactions from './utils/classifyTransactions';
import '../styles/App.css';

const CostSharingForYnab = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [budgetData, setBudgetData] = useState({
    accounts: [],
    categoryGroups: [],
  });
  const [transactionsStartDate, setTransactionsStartDate] = useState(getFiveDaysAgo());
  const [transactionsEndDate, setTransactionsEndDate] = useState(new Date());
  const [checkedTransactions, setCheckedTransactions] = useState({
    transactions: [],
    checkmarks: [],
  });
  const [splitDate, setSplitDate] = useState(new Date());
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  const [sharedAccounts, setSharedAccounts] = useState([]);
  const [sharedParentCategories, setSharedParentCategories] = useState([]);
  const [splitAccountId, setSplitAccountId] = useState('');
  const [errorData, setErrorData] = useState(null);
  const [privacyActive, setPrivacyActive] = useState(true);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const isSplitTransactionDisabled = (
    !checkedTransactions.transactions.length
    || !splitAccountId
  );

  const classifiedTransactions = classifyTransactions({
    displayedTransactions,
    sharedAccounts,
    sharedParentCategories,
    splitAccountId,
  });

  const getBudgetData = async () => {
    try {
      const accounts = await getAccounts();
      const categoryGroups = await getCategoryGroups();
      setBudgetData({ accounts, categoryGroups });
    } catch (error) {
      setErrorData({
        status: error.response?.status,
        message: error.message,
      });
    }
  };

  const getDisplayedTransactions = async ({ startDate, endDate }) => {
    const isTransactionATransfer = (transaction) => !!transaction.transfer_account_id;

    try {
      const transactionsSinceStartDate = await getTransactionsSinceDate(startDate);

      const transactionsToDisplay = transactionsSinceStartDate.filter((transaction) => (
        isDateBeforeEndDate(transaction.date, endDate)
        && transaction.approved
        && !isTransactionATransfer(transaction)
      ));

      setDisplayedTransactions(transactionsToDisplay);
    } catch (error) {
      setErrorData({
        message: error.message,
        status: error.response?.status,
      });
    }
  };

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
        newTxns.transactions = [...classifiedTransactions.transactionsInSharedCategories];
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
      account_id: splitAccountId,
      date: convertDateToString(splitDate),
      amount: Number((
        _.reduce(halvedCostsByCategory, (sum, amt) => sum + amt) * 1000)
        .toFixed(2)) * -1,
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
      .then(() => {
        setIsConfirmationVisible(true);
        getDisplayedTransactions({
          startDate: transactionsStartDate,
          endDate: transactionsEndDate,
        });
      })
      .catch((error) => {
        setErrorData({
          status: error.response?.status,
          message: error.message,
        });
      });
  }

  useEffect(() => {
    getBudgetData();
  }, []);

  useEffect(() => {
    if (budgetData) setIsPageLoading(false);
  }, [budgetData]);

  return isPageLoading ? 'Loading...' : (
    <div className="app-container">
      {privacyActive && <PrivacyWindow setPrivacyActive={setPrivacyActive} />}
      <Header setPrivacyActive={setPrivacyActive} />
      <div className="section-container">
        <AccountSelector
          sharedAccounts={sharedAccounts}
          sharedParentCategories={sharedParentCategories}
          splitAccountId={splitAccountId}
          budgetData={budgetData}
          setSharedAccounts={setSharedAccounts}
          setSharedParentCategories={setSharedParentCategories}
          setSplitAccountId={setSplitAccountId}
        />
        <div id="date-range-area">
          <p>
            <b>Required:&nbsp;</b>
            Specify a date range, such as a one-month period, that you want to
            split transactions for. For example, you might calculate what the
            other person owes you for shared costs every week, two weeks, or
            once a month.
          </p>
          <form>
            <label htmlFor="start">
              Start date:
              <input
                type="date"
                id="start"
                value={convertDateToString(transactionsStartDate)}
                onChange={(e) => setTransactionsStartDate(convertStringToDate(e.target.value))}
              />
            </label>
            <label htmlFor="end">
              End date:
              <input
                type="date"
                id="end"
                value={convertDateToString(transactionsEndDate)}
                onChange={(e) => setTransactionsEndDate(convertStringToDate(e.target.value, false))}
              />
            </label>
          </form>
        </div>
        <button
          type="button"
          onClick={() => {
            getDisplayedTransactions({
              startDate: transactionsStartDate,
              endDate: transactionsEndDate,
            });
            document.getElementById('transaction-container').scrollIntoView(true);
          }}
          id="update-txn-btn"
          className="update-btn"
        >
          Show Transactions
        </button>
      </div>
      <section id="transaction-container" className="section-container">
        <h1 className="section-header">Select Transactions to Split</h1>
        <p>
          Select all the transactions in shared budget categories that you want
          included in the split transaction. If a transaction is present in a
          shared category but did not come from a shared banking account, or vice
          versa, you&apos;ll notice a yellow warning symbol. Use these warnings to review
          if anything is missing or incorrect.
        </p>
        <div id="transaction-area">
          <TransactionWindow
            title="Transactions in Shared Categories"
            transactions={classifiedTransactions.transactionsInSharedCategories}
            transactionsSharedInOneButNotOther={
              classifiedTransactions.transactionsSharedInOneButNotOther
            }
            checkmarks={checkedTransactions.checkmarks}
            handleSelectTransaction={handleSelectTransaction}
            selectAll={selectAll}
          />
          <TransactionWindow
            title="Transactions in Shared Banking Accounts"
            transactions={classifiedTransactions.transactionsInSharedBankAccounts}
            transactionsSharedInOneButNotOther={
              classifiedTransactions.transactionsSharedInOneButNotOther
            }
            handleSelectTransaction={handleSelectTransaction}
          />
          <TransactionWindow
            title="IOU Account"
            transactions={classifiedTransactions.iouAccountTransactions}
            transactionsSharedInOneButNotOther={
              classifiedTransactions.transactionsSharedInOneButNotOther
            }
            handleSelectTransaction={handleSelectTransaction}
          />
        </div>
      </section>
      <div id="split-btn-area" className="section-container">
        <form>
          <h1 className="section-header">Create Split Transaction</h1>
          <p>
            Choose a date you want to create the transaction in YNAB that will
            halve costs between you and the other person, and hit &quot;Split Selected
            Transactions On Date.&quot; The new transaction will be split across all
            the original categories, so you can continue to have visibility into
            where your shared dollars are being spent.
          </p>
          <input
            type="date"
            id="split-date"
            value={convertDateToString(splitDate)}
            onChange={(e) => setSplitDate(convertStringToDate(e.target.value))}
          />
          <button
            type="submit"
            onClick={createSplitEntry}
            id="split-txn-btn"
            className="update-btn"
            disabled={isSplitTransactionDisabled}
          >
            Split Selected Transactions On Date
          </button>
          {isSplitTransactionDisabled && (
            <span className="caution-text">
              Please select one or more transactions to split and choose an IOU account
              to receive the split transaction
            </span>
          )}
        </form>
      </div>
      {
        isConfirmationVisible && (
          <Confirmation
            setIsConfirmationVisible={setIsConfirmationVisible}
          />
        )
      }
      {
        errorData && (
          <Error
            errorData={errorData}
            setErrorData={setErrorData}
          />
        )
      }
      <Nav setPrivacyActive={setPrivacyActive} />
    </div>
  );
};

export default CostSharingForYnab;
