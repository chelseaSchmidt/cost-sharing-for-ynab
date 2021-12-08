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
  const [checkedTransactions, setCheckedTransactions] = useState([]);
  const [splitDate, setSplitDate] = useState(new Date());
  const [classifiedTransactions, setClassifiedTransactions] = useState({});
  const [sharedAccounts, setSharedAccounts] = useState([]);
  const [sharedParentCategories, setSharedParentCategories] = useState([]);
  const [splitAccountId, setSplitAccountId] = useState('');
  const [errorData, setErrorData] = useState(null);
  const [shouldDisplayPrivacyPolicy, setShouldDisplayPrivacyPolicy] = useState(true);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const {
    transactionsInSharedBankAccounts = [],
    transactionsInSharedCategories = [],
    transactionsSharedInOneButNotOther = [],
    iouAccountTransactions = [],
  } = classifiedTransactions;

  const isSplitTransactionDisabled = (
    !checkedTransactions.length
    || !splitAccountId
  );

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

  const getClassifiedTransactions = async ({ startDate, endDate }) => {
    const isTransactionATransfer = (transaction) => !!transaction.transfer_account_id;

    try {
      const transactionsSinceStartDate = await getTransactionsSinceDate(startDate);

      const displayedTransactions = transactionsSinceStartDate.filter((transaction) => (
        isDateBeforeEndDate(transaction.date, endDate)
        && transaction.approved
        && !isTransactionATransfer(transaction)
      ));

      setClassifiedTransactions(classifyTransactions({
        displayedTransactions,
        sharedAccounts,
        sharedParentCategories,
        splitAccountId,
      }));
    } catch (error) {
      setErrorData({
        message: error.message,
        status: error.response?.status,
      });
    }
  };

  const selectTransaction = (e, transaction) => {
    setCheckedTransactions(
      e.target.checked
        ? [...checkedTransactions, transaction]
        : checkedTransactions.filter(({ id }) => id !== transaction.id),
    );
  };

  const selectAllTransactions = (e) => {
    setIsSelectAllChecked(e.target.checked);
    setCheckedTransactions(e.target.checked ? [...transactionsInSharedCategories] : []);
  };

  const createSplitEntry = async (e) => {
    e.preventDefault();

    const categorizedTransactions = _.groupBy(checkedTransactions, 'category_id');

    const categorizedAmounts = _.reduce(
      categorizedTransactions,
      (accum, transactions, categoryId) => {
        accum[categoryId] = _.sumBy(transactions, 'amount');
        return accum;
      },
      {},
    );
    const halvedCategorizedAmounts = _.reduce(
      categorizedAmounts,
      (accum, amount, categoryId) => {
        accum[categoryId] = Math.round(amount / 2);
        return accum;
      },
      {},
    );

    const summaryTransaction = {
      account_id: splitAccountId,
      date: convertDateToString(splitDate),
      amount: _.reduce(halvedCategorizedAmounts, (sum, amt) => sum - amt, 0),
      payee_id: null,
      payee_name: null,
      category_id: null,
      memo: null,
      cleared: 'uncleared',
      approved: true,
      flag_color: null,
      import_id: null,
      subtransactions: _.map(halvedCategorizedAmounts, (amount, category_id) => ({
        amount: -(amount),
        payee_id: null,
        payee_name: 'Shared Costs',
        category_id,
        memo: null,
      })),
    };

    try {
      await createSplitTransaction(summaryTransaction);
      setIsConfirmationVisible(true);
      getClassifiedTransactions({
        startDate: transactionsStartDate,
        endDate: transactionsEndDate,
      });
    } catch (error) {
      setErrorData({
        status: error.response?.status,
        message: error.message,
      });
    }
  };

  useEffect(() => {
    getBudgetData();
  }, []);

  useEffect(() => {
    if (budgetData) setIsPageLoading(false);
  }, [budgetData]);

  return isPageLoading ? 'Loading...' : (
    <div className="app-container">
      {
        shouldDisplayPrivacyPolicy && (
          <PrivacyWindow setShouldDisplayPrivacyPolicy={setShouldDisplayPrivacyPolicy} />
        )
      }

      <Header setShouldDisplayPrivacyPolicy={setShouldDisplayPrivacyPolicy} />

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
          <p><b>Select transaction date range</b></p>
          <form id="date-range-form">
            <label htmlFor="transactions-start-date">
              Start date:
              <input
                type="date"
                id="transactions-start-date"
                value={convertDateToString(transactionsStartDate)}
                onChange={(e) => setTransactionsStartDate(convertStringToDate(e.target.value))}
              />
            </label>
            <label htmlFor="transactions-end-date">
              End date:
              <input
                type="date"
                id="transactions-end-date"
                value={convertDateToString(transactionsEndDate)}
                onChange={(e) => setTransactionsEndDate(convertStringToDate(e.target.value, false))}
              />
            </label>
          </form>
        </div>
        <button
          type="button"
          onClick={() => {
            getClassifiedTransactions({
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
            transactions={transactionsInSharedCategories}
            transactionsSharedInOneButNotOther={transactionsSharedInOneButNotOther}
            selectTransaction={selectTransaction}
            selectAllTransactions={selectAllTransactions}
            isSelectAllChecked={isSelectAllChecked}
          />
          <TransactionWindow
            title="Transactions in Shared Banking Accounts"
            transactions={transactionsInSharedBankAccounts}
            transactionsSharedInOneButNotOther={transactionsSharedInOneButNotOther}
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
        <TransactionWindow
          title="IOU Account"
          transactions={iouAccountTransactions}
        />
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
      <Nav setShouldDisplayPrivacyPolicy={setShouldDisplayPrivacyPolicy} />
    </div>
  );
};

export default CostSharingForYnab;
