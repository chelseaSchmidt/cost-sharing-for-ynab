/* eslint-disable no-param-reassign, camelcase */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import AccountButtons from './AccountButtons';
import CategoryButtons from './CategoryButtons';
import TransactionWindow from './TransactionWindow';
import Confirmation from './Confirmation';
import Modal from './Modal';
import Header from '../../sharedComponents/Header';
import Nav from './Nav';
import Error from './Error';
import PrivacyPolicy from '../../sharedComponents/PrivacyPolicy';
import Instructions from '../../sharedComponents/Instructions';
import {
  SectionHeader,
  BaseButton,
  WarningIcon,
  Tooltip,
  LinkishButton,
  Spinner,
} from './styledComponents';
import {
  getTransactionsSinceDate,
  getAccounts,
  getCategoryGroups,
  createSplitTransaction,
} from './utils/networkRequests';
import {
  convertDateToString,
  convertStringToDate,
  isTransactionBeforeDate,
  getFirstDateOfLastMonth,
  getLastDateOfLastMonth,
} from './utils/dateHelpers';
import classifyTransactions from './utils/classifyTransactions';
import modalNames from './modalNames';
import '../styles/global.css';

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

const SectionTile = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60vw;
  max-width: 1290px;
  padding: 50px 75px;
  margin-bottom: 50px;
  border-radius: 12px;
  box-shadow: 0 0 3px 0 #9298a2;
  background-color: white;
`;

const TransactionsTile = styled(SectionTile)`
  max-height: 92vh;
`;

const SectionContent = styled.div`
  width: 100%;
  margin-bottom: 40px;
`;

const Subtitle = styled.p`
  font-weight: bold;
  margin-bottom: 20px;
`;

const RowOrColumn = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 645px) {
    flex-direction: column;
  }
`;

const DateRangeForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const DateRangeLabel = styled.label``;

const DateRangeInput = styled.input`
  margin: 10px;
  cursor: text;

  ::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

const IouAccountSelector = styled.select`
  cursor: pointer;

  :focus {
    outline: none;
  }
`;

const ShowTransactionsButton = styled(BaseButton)`
  margin: 20px 10px 0 10px;
`;

const ReviewTransactionsButton = styled(BaseButton)`
  background-color: maroon;
  margin-left: 10px;
  border: none;
  box-shadow: 0 0 3px 0 black;

  :hover {
    color: maroon;
  }
`;

const SplitTransactionsButton = styled(BaseButton)`
  box-sizing: border-box;
  position: relative;
  height: 35px;
  width: 182px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;

  :disabled:hover {
    > * {
      visibility: visible;
    }
  }
`;

const ButtonDisabledPopup = styled(Tooltip)`
  bottom: 125%;
  right: unset;
  left: 50%;
  width: 200px;
  margin-left: -100px;
  padding: 10px 5px;
  font-size: 12px;

  ::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border: 5px solid;
    border-color:  #444 transparent transparent transparent;
  }
`;

const MissingTransactionsWarning = styled.p`
  display: flex;
  align-items: center;
  color: red;
`;

const TransactionWindowContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 12px;
`;

/* Main Component */

const CostSharingForYnab = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(false);
  const [budgetData, setBudgetData] = useState({
    accounts: [],
    categoryGroups: [],
  });
  const [transactionsStartDate, setTransactionsStartDate] = useState(getFirstDateOfLastMonth());
  const [transactionsEndDate, setTransactionsEndDate] = useState(getLastDateOfLastMonth());
  const [checkedTransactions, setCheckedTransactions] = useState([]);
  const [dateToSplitCosts, setDateToSplitCosts] = useState(getLastDateOfLastMonth());
  const [classifiedTransactions, setClassifiedTransactions] = useState({});
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedParentCategories, setSelectedParentCategories] = useState([]);
  const [iouAccountId, setIouAccountId] = useState('');
  const [iouAccountTransactions, setIouAccountTransactions] = useState([]);
  const [isIouTransactionLoading, setIsIouTransactionLoading] = useState(false);
  const [errorData, setErrorData] = useState(null);
  const [activeModal, setActiveModal] = useState(modalNames.PRIVACY_POLICY);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const {
    transactionsInSharedCategories = [],
    sharedAccountErrorTransactions = [],
    sharedCategoryErrorTransactions = [],
  } = classifiedTransactions;

  const isSplitTransactionDisabled = (
    !checkedTransactions.length
    || !iouAccountId
  );

  const buttonDisabledMessage = !checkedTransactions.length
    ? (
      (!iouAccountId && 'Please select shared costs and pick an IOU account first')
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
      setAreTransactionsLoading(true);
      const transactionsSinceStartDate = await getTransactionsSinceDate(startDate);

      const displayedTransactions = transactionsSinceStartDate.filter((transaction) => (
        isTransactionBeforeDate(transaction, endDate)
        && transaction.approved
        && !isTransactionATransfer(transaction)
      ));

      setClassifiedTransactions(classifyTransactions({
        displayedTransactions,
        selectedAccounts,
        selectedParentCategories,
      }));
    } catch (error) {
      setErrorData({
        message: error.message,
        status: error.response?.status,
      });
    }
    setAreTransactionsLoading(false);
  };

  const toggleTransactionSelection = ({
    isSelected,
    transaction,
  }) => {
    setCheckedTransactions(
      isSelected
        ? [...checkedTransactions, transaction]
        : checkedTransactions.filter(({ id }) => id !== transaction.id),
    );
  };

  const toggleSelectAll = ({ isSelected }) => {
    setIsSelectAllChecked(isSelected);
    setCheckedTransactions(isSelected ? [...transactionsInSharedCategories] : []);
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
      account_id: iouAccountId,
      date: convertDateToString(dateToSplitCosts),
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
      setIsIouTransactionLoading(true);
      const transaction = await createSplitTransaction(summaryTransaction);
      setIsConfirmationVisible(true);
      setIouAccountTransactions([...iouAccountTransactions, transaction]);
      setCheckedTransactions([]);
    } catch (error) {
      setErrorData({
        status: error.response?.status,
        message: error.message,
      });
    }
    setIsIouTransactionLoading(false);
  };

  useEffect(() => {
    getBudgetData();
  }, []);

  useEffect(() => {
    if (budgetData) setIsPageLoading(false);
  }, [budgetData]);

  useEffect(() => {
    if (areTransactionsLoading) setCheckedTransactions([]);
  }, [areTransactionsLoading]);

  return isPageLoading ? 'Loading...' : (
    <Container>

      {/* Modals */}

      {
        activeModal && (
          <Modal
            onClose={() => setActiveModal(null)}
            buttonText="OK"
            shouldCloseOnOverlayClick={activeModal !== modalNames.PRIVACY_POLICY}
          >
            {activeModal === modalNames.PRIVACY_POLICY && (
              <PrivacyPolicy />
            )}

            {activeModal === modalNames.TRANSACTION_REVIEW && (
              <TransactionWindow
                title="Transactions in shared accounts missing from shared budget categories"
                transactions={sharedAccountErrorTransactions}
              />
            )}

            {activeModal === modalNames.INSTRUCTIONS && (
              <Instructions style={{ padding: '20px' }} />
            )}
          </Modal>
        )
      }

      {/* Popup messages */}

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

      {/* Main content */}

      <Header setActiveModal={setActiveModal} />

      <InstructionsButtonContainer>
        <LinkishButton
          type="button"
          onClick={() => setActiveModal(modalNames.INSTRUCTIONS)}
        >
          Instructions
        </LinkishButton>
      </InstructionsButtonContainer>

      <SectionTile>
        <SectionHeader>Choose Accounts and Categories</SectionHeader>

        <SectionContent>
          <Subtitle>Select the credit card(s) you use for shared expenses</Subtitle>

          <AccountButtons
            accounts={budgetData.accounts}
            selectedAccounts={selectedAccounts}
            setSelectedAccounts={setSelectedAccounts}
          />
        </SectionContent>

        <SectionContent>
          <Subtitle>Select the YNAB parent category(ies) where you track shared expenses</Subtitle>

          <CategoryButtons
            // FIXME: rename categoryGroups to parentCategories
            parentCategories={budgetData.categoryGroups}
            selectedParentCategories={selectedParentCategories}
            setSelectedParentCategories={setSelectedParentCategories}
          />
        </SectionContent>

        <SectionContent>
          <Subtitle>
            Select the &quot;IOU&quot; account that shows what your partner owes you
          </Subtitle>

          <div>
            <IouAccountSelector
              onChange={(e) => setIouAccountId(e.target.value)}
              defaultValue="none"
            >
              <option disabled value="none">
                -- select an account --
              </option>

              {
                budgetData.accounts.map(({ name, id }) => (
                  <option
                    id={`iou-${id}`}
                    key={`iou-${id}`}
                    value={id}
                  >
                    {name}
                  </option>
                ))
              }
            </IouAccountSelector>
          </div>
        </SectionContent>

        <SectionContent>
          <Subtitle>Select transaction date range</Subtitle>

          <DateRangeForm>
            <DateRangeLabel htmlFor="transactions-start-date">
              Start date:
              <DateRangeInput
                type="date"
                id="transactions-start-date"
                value={convertDateToString(transactionsStartDate)}
                onChange={(e) => setTransactionsStartDate(convertStringToDate(e.target.value))}
              />
            </DateRangeLabel>

            <DateRangeLabel htmlFor="transactions-end-date">
              End date:
              <DateRangeInput
                type="date"
                id="transactions-end-date"
                value={convertDateToString(transactionsEndDate)}
                onChange={(e) => setTransactionsEndDate(convertStringToDate(e.target.value, false))}
              />
            </DateRangeLabel>
          </DateRangeForm>
        </SectionContent>

        <ShowTransactionsButton
          type="button"
          onClick={() => {
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

      <TransactionsTile id="transaction-container">
        <SectionHeader>Select Shared Costs</SectionHeader>

        {
          !areTransactionsLoading && !!sharedAccountErrorTransactions.length && (
            <MissingTransactionsWarning>
              <WarningIcon>!</WarningIcon>
              You have costs in shared accounts that are missing from shared budget categories.
              <ReviewTransactionsButton
                type="button"
                onClick={() => setActiveModal(modalNames.TRANSACTION_REVIEW)}
              >
                Review
              </ReviewTransactionsButton>
            </MissingTransactionsWarning>
          )
        }

        <TransactionWindowContainer>
          <TransactionWindow
            loading={areTransactionsLoading}
            transactions={transactionsInSharedCategories}
            checkedTransactions={checkedTransactions}
            transactionsSharedInOneButNotOther={sharedCategoryErrorTransactions}
            toggleTransactionSelection={toggleTransactionSelection}
            toggleSelectAll={toggleSelectAll}
            isSelectAllChecked={isSelectAllChecked}
            shouldShowIcon
            isEditable
          />
        </TransactionWindowContainer>
      </TransactionsTile>

      <SectionTile>
        <form>
          <SectionHeader>Split the Total Cost</SectionHeader>

          <p>
            Charge half the shared costs to the &quot;IOU&quot;
            account that shows what your partner owes you, and reduce
            your expenses by the same amount.
          </p>

          <RowOrColumn>
            <DateRangeInput
              type="date"
              value={convertDateToString(dateToSplitCosts)}
              onChange={(e) => setDateToSplitCosts(convertStringToDate(e.target.value))}
            />

            <SplitTransactionsButton
              type="submit"
              onClick={createSplitEntry}
              disabled={isSplitTransactionDisabled}
            >
              {
                isIouTransactionLoading
                  ? <Spinner />
                  : 'Split Costs On This Date'
              }

              <ButtonDisabledPopup>{buttonDisabledMessage}</ButtonDisabledPopup>
            </SplitTransactionsButton>
          </RowOrColumn>
        </form>

        <TransactionWindow
          loading={isIouTransactionLoading}
          title="IOU Transaction Preview"
          transactions={iouAccountTransactions}
        />
      </SectionTile>

      <Nav setActiveModal={setActiveModal} />

    </Container>
  );
};

export default CostSharingForYnab;
