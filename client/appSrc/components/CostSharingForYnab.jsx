/* eslint-disable no-param-reassign, camelcase */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import TransactionWindow from './TransactionWindow';
import AccountSelector from './AccountSelector';
import Confirmation from './Confirmation';
import Modal from './Modal';
import Header from '../../sharedComponents/Header';
import Nav from './Nav';
import Error from './Error';
import PrivacyPolicy from '../../sharedComponents/PrivacyPolicy';
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
import Instructions from '../../sharedComponents/Instructions';

/* Styled Components */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InstructionsButtonContainer = styled.div`
  margin-top: -25px;
  margin-bottom: 25px;
`;

const InstructionsButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  text-rendering: unset;
  align-items: unset;
  font: unset;
  box-sizing: unset;
  writing-mode: unset;
  -webkit-writing-mode: unset;
  letter-spacing: unset;
  word-spacing: unset;
  text-transform: unset;
  text-indent: unset;
  text-shadow: unset;
  display: unset;
  background: none;
  border: none;

  text-align: left;
  padding: 0;
  margin: 0 10px;
  cursor: pointer;
  text-decoration: underline;
  color: #464b46;
  font-size: 12px;

  :hover, :visited:hover {
    color: blue;
  }

  :visited {
    color: #464b46;
  }
`;

const SectionTile = styled.section`
  background-color: white;
  box-shadow: 0 0 3px 0 #9298a2;
  max-width: 1290px;
  border-radius: 12px;
  padding: 50px 75px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60vw;
`;

const DateRangeSelectorContainer = styled.div`
  width: 100%;
`;

const DateRangeForm = styled.form`
  display: flex;
  flex-direction: column;

  label > input {
    margin: 10px;
    cursor: text;
  }

  label > input::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

const DateRangeFormDescription = styled.p`
  font-weight: bold;
  margin: 0 0 20px 0;
`;

const ShowTransactionsButton = styled.button`
  box-sizing: unset;
  background-color: #11518c;
  color: white;
  border-radius: 8px;
  height: 25px;
  margin: 20px 10px 0 10px;
  font-size: 14px;
  border: 1px solid white;
  box-shadow: 0 1px 2px 0 #515852;
  padding: 2px 15px;
  font-weight: 400;
  cursor: pointer;

  :hover {
    background-color: lightgray;
  }

  :focus {
    outline: none;
  }

  :disabled {
    background-color: gray;
    cursor: not-allowed;
  }
`;

/* Main Component */

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

  const buttonDisabledMessage = !checkedTransactions.length
    ? (
      (!splitAccountId && 'Please select shared costs and pick an IOU account first')
      || 'Please select shared costs first'
    )
    : 'Please pick an IOU account first';

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
      const transaction = await createSplitTransaction(summaryTransaction);
      setIsConfirmationVisible(true);
      setClassifiedTransactions({
        ...classifiedTransactions,
        iouAccountTransactions: [
          // TODO: remove this from transaction classification logic and track in separate state
          // ...iouAccountTransactions
          transaction,
        ],
      });
      setCheckedTransactions([]);
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
    <Container>
      {activeModal && (
        <Modal
          onClose={() => setActiveModal(null)}
          buttonText="OK"
          shouldCloseOnOverlayClick={activeModal !== 'privacyPolicy'}
        >
          {activeModal === 'privacyPolicy' && (
            <PrivacyPolicy />
          )}

          {activeModal === 'transactionReview' && (
            <TransactionWindow
              title="Transactions in shared accounts missing from shared budget categories"
              transactions={sharedAccountErrorTransactions}
            />
          )}

          {activeModal === 'instructions' && (
            <Instructions style={{ padding: '20px' }} />
          )}
        </Modal>
      )}

      <Header setActiveModal={setActiveModal} />

      <InstructionsButtonContainer>
        <InstructionsButton
          type="button"
          onClick={() => setActiveModal('instructions')}
        >
          Instructions
        </InstructionsButton>
      </InstructionsButtonContainer>

      <SectionTile>
        <AccountSelector
          sharedAccounts={sharedAccounts}
          sharedParentCategories={sharedParentCategories}
          splitAccountId={splitAccountId}
          budgetData={budgetData}
          setSharedAccounts={setSharedAccounts}
          setSharedParentCategories={setSharedParentCategories}
          setSplitAccountId={setSplitAccountId}
        />

        <DateRangeSelectorContainer>
          <DateRangeFormDescription>
            Select transaction date range
          </DateRangeFormDescription>

          <DateRangeForm>
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
          </DateRangeForm>
        </DateRangeSelectorContainer>

        <ShowTransactionsButton
          type="button"
          onClick={() => {
            // FIXME: this gets IOU account transactions for the view-transactions date range
            // instead of the IOU charge date, which is confusing in latest version of the layout
            getClassifiedTransactions({
              startDate: transactionsStartDate,
              endDate: transactionsEndDate,
            });
            document.getElementById('transaction-container').scrollIntoView(true);
          }}
        >
          Show Transactions
        </ShowTransactionsButton>
      </SectionTile>
      <SectionTile id="transaction-container">
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
      </SectionTile>
      <SectionTile id="split-btn-area">
        <form>
          <h1 className="section-header">Split the Total Cost</h1>
          <p>
            Charge half the shared costs to the &quot;IOU&quot;
            account that shows what your partner owes you, and reduce
            your expenses by the same amount.
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
            <span className="split-txn-btn-text">{buttonDisabledMessage}</span>
          </button>
        </form>
        <TransactionWindow
          title="IOU Transaction Preview"
          transactions={iouAccountTransactions}
        />
      </SectionTile>
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
    </Container>
  );
};

export default CostSharingForYnab;
