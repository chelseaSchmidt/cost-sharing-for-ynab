/* eslint-disable no-param-reassign, camelcase */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import TransactionWindow from './TransactionWindow';
import AccountSelector from './AccountSelector';
import Confirmation from './Confirmation';
import Modal from './Modal';
import Header from './Header';
import Nav from './Nav';
import Error from './Error';
import PrivacyPolicy from './PrivacyPolicy';
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
  const [activeModal, setActiveModal] = useState('privacyPolicy');
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const {
    // transactionsInSharedBankAccounts = [],
    transactionsInSharedCategories = [],
    sharedAccountErrorTransactions = [],
    sharedCategoryErrorTransactions = [],
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
        activeModal === 'privacyPolicy' && (
          <Modal
            onClose={() => setActiveModal(null)}
            buttonText="OK"
          >
            <PrivacyPolicy />
          </Modal>
        )
      }
      {
        activeModal === 'transactionReview' && (
          <Modal
            onClose={() => setActiveModal(null)}
            buttonText="OK"
          >
            <TransactionWindow
              title="Transactions in shared accounts missing from shared budget categories"
              transactions={sharedAccountErrorTransactions}
            />
          </Modal>
        )
      }

      <Header setActiveModal={setActiveModal} />

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
        <h1 className="section-header">Select Shared Costs</h1>
        {
          !!sharedAccountErrorTransactions.length && (
            <p style={{ display: 'flex', color: 'red', alignItems: 'center' }}>
              <span className="warning-symbol">!</span>
              <span>
                You have costs in shared accounts that are missing from shared budget categories.
              </span>
              <button
                type="button"
                className="review-transactions-btn"
                onClick={() => setActiveModal('transactionReview')}
              >
                Review these transactions
              </button>
            </p>
          )
        }
        <div id="transaction-area">
          <TransactionWindow
            transactions={transactionsInSharedCategories}
            transactionsSharedInOneButNotOther={sharedCategoryErrorTransactions}
            selectTransaction={selectTransaction}
            selectAllTransactions={selectAllTransactions}
            isSelectAllChecked={isSelectAllChecked}
            shouldShowIcon
            isEditable
          />
        </div>
      </section>
      <div id="split-btn-area" className="section-container">
        <form>
          <h1 className="section-header">Split the Total Cost</h1>
          <p>
            Create one transaction in your IOU account that splits the total cost
            of your selected transactions, distributed across the same categories.
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
            Split Costs On This Date
          </button>
          {isSplitTransactionDisabled && (
            <span className="caution-text">
              Please select one or more transactions to split and choose an IOU account
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
      <Nav setActiveModal={setActiveModal} />
    </div>
  );
};

export default CostSharingForYnab;
