import { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import BudgetAutocomplete from './BudgetAutocomplete';
import DateSelector from './DateSelector';
import InfoIcon from './InfoIcon';
import TransactionWindow from './TransactionWindow';
import Modal from './Modal';
import Nav from './Nav';
import ErrorPopup from './ErrorPopup';
import PrivacyPolicy from '../../../shared/PrivacyPolicy';
import Instructions from '../../../shared/Instructions';
import { SectionHeader, Spinner } from './styledComponents';
import {
  createTransaction,
  getTransactionsSinceDate,
  getAccounts,
  getParentCategories,
} from './utils/networkRequests';
import {
  convertDateToString,
  toDate,
  getFirstDateOfLastMonth,
  getLastDateOfLastMonth,
} from './utils/dateHelpers';
import cleanAndGroupTransactions from './utils/cleanAndGroupTransactions';
import { hasMessage, hasResponseAndStatus } from './utils/general';
import breakpoints from '../../../shared/breakpoints';
import colors from '../../../shared/colors';
import { Button, Hyperlink } from '../../../shared/styledComponents';
import { MODALS_CONTAINER_ID, TRANSACTION_SELECTION_FORM_ID } from '../constants';
import '../styles/global.css';
import {
  Account,
  BudgetData,
  ErrorData,
  ModalName,
  ParentCategory,
  Transaction,
  TransactionGroups,
  TransactionPayload,
} from '../types';
import AppHeader from './AppHeader';
import Popup from './Popup';
import TransactionSearchForm from './TransactionSearchForm';
import WarningIcon from './WarningIcon';

/* CONSTANTS */

const TILE_X_PADDING_LG = 75;
const TILE_X_PADDING_SM = 30;
const TILE_X_PADDING_XS = 10;

/* STYLED COMPONENTS */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const Modals = styled.div``;

const NonModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
`;

const HelpButtonContainer = styled.div`
  margin-top: -25px;
  margin-bottom: 25px;
  color: ${colors.infoIcon};

  button {
    text-decoration: none;
    border-bottom: 1px dotted ${colors.infoIcon};
    padding-bottom: 3px;

    &:hover {
      color: ${colors.primary};
      border-color: ${colors.primary};

      * {
        color: ${colors.primary};
        border-color: ${colors.primary};
      }
    }
  }
`;

const SectionTile = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 90vw;
  max-width: 1290px;
  padding: 50px ${TILE_X_PADDING_LG}px;
  margin-bottom: 50px;
  border-radius: 3px;
  box-shadow: 0 1px 2px 0 #999, 0 -1px 4px 1px #ddd;
  background-color: white;

  @media (max-width: ${breakpoints.mobile}) {
    box-sizing: border-box;
    width: calc(100% - 20px);
    padding: 50px ${TILE_X_PADDING_SM}px;
  }

  @media (max-width: ${breakpoints.tiny}) {
    box-sizing: border-box;
    width: calc(100% - 20px);
    padding: 50px ${TILE_X_PADDING_XS}px;
  }
`;

const TransactionsTile = styled(SectionTile)`
  max-height: 92vh;
`;

const SectionContent = styled.div`
  width: 100%;
  margin-bottom: 40px;

  @media (max-width: ${breakpoints.mobile}) {
    margin-bottom: 50px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const NoWrap = styled.span`
  white-space: nowrap;
`;

const ReviewTransactionsButton = styled(Button)`
  background: rgb(128, 0, 0);
  margin-left: 10px;

  &:active {
    background: rgba(128, 0, 0, 0.7);
  }

  &:hover {
    color: rgb(128, 0, 0);
  }
`;

const SplitTransactionsButton = styled(Button)`
  @media (max-width: ${breakpoints.mobile}) {
    margin: 10px 0 0 0;
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
  width: calc(100% + ${TILE_X_PADDING_LG * 2}px);
  overflow: auto;

  @media (max-width: ${breakpoints.mobile}) {
    width: calc(100% + ${TILE_X_PADDING_SM * 2}px);
  }

  @media (max-width: ${breakpoints.tiny}) {
    width: calc(100% + ${TILE_X_PADDING_XS * 2}px);
  }
`;

const CostPercentField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 20px;
`;

const CostPercentLabel = styled.label``;

const CostPercentSlider = styled.input`
  cursor: pointer;
`;

const CostPercentInput = styled.input`
  width: 50px;
  border: 1px solid ${colors.lightNeutralAccent};
  border-radius: 5px;
  padding: 10px 5px;
  font-size: inherit;
`;

const Spacer = styled.div`
  height: 20px;
`;

/* MAIN */

const App = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(false);
  const [budgetData, setBudgetData] = useState<BudgetData>({
    accounts: [],
    parentCategories: [],
  });
  const [myShare, setMyShare] = useState(50);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [dateToSplitCosts, setDateToSplitCosts] = useState(getLastDateOfLastMonth());
  const [transactionGroups, setTransactionGroups] = useState<TransactionGroups>({
    transactions: [],
    accountFlags: [],
    categoryFlags: [],
  });
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);
  const [selectedParentCategories, setSelectedParentCategories] = useState<ParentCategory[]>([]);
  const [dateRange, setDateRange] = useState({
    start: getFirstDateOfLastMonth(),
    end: getLastDateOfLastMonth(),
  });
  const [iouAccountId, setIouAccountId] = useState('');
  const [iouAccountTransactions, setIouAccountTransactions] = useState<Transaction[]>([]);
  const [isIouTransactionLoading, setIsIouTransactionLoading] = useState(false);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [activeModal, setActiveModal] = useState<ModalName | null>(
    ModalName.PRIVACY_POLICY_REQUIRED,
  );
  const [succeeded, setSucceeded] = useState(false);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const { transactions, accountFlags, categoryFlags } = transactionGroups;

  const isSplitTransactionDisabled = !selectedTransactions.length || !iouAccountId;

  const buttonDisabledMessage = !selectedTransactions.length
    ? (!iouAccountId && 'Please select shared costs and an IOU account') ||
      'Please select shared costs'
    : 'Please select an IOU account';

  const handleInfoClick = () => setActiveModal(ModalName.INSTRUCTIONS);

  const closeModal = () => setActiveModal(null);

  const displayErrorMessage = (error: unknown) => {
    setErrorData({
      status: hasResponseAndStatus(error) ? error.response.status : 0,
      message: hasMessage(error) ? error.message : 'Something went wrong',
    });
  };

  const getBudgetData = async () => {
    try {
      const accounts = await getAccounts();
      const parentCategories = await getParentCategories();
      setBudgetData({ accounts, parentCategories });
    } catch (error) {
      displayErrorMessage(error);
    }
  };

  const handleTransactionSearch = async () => {
    setAreTransactionsLoading(true);
    try {
      setTransactionGroups(
        cleanAndGroupTransactions({
          transactionsSinceStartDate: await getTransactionsSinceDate(dateRange.start),
          endDate: dateRange.end,
          selectedAccounts,
          selectedParentCategories,
        }),
      );
    } catch (error) {
      displayErrorMessage(error);
    }
    setAreTransactionsLoading(false);
  };

  const toggleTransactionSelection = useCallback(
    ({ isSelected, transaction }: { isSelected: boolean; transaction: Transaction }) => {
      setSelectedTransactions((previousSelected) =>
        isSelected
          ? [...previousSelected, transaction]
          : previousSelected.filter(({ id }) => id !== transaction.id),
      );
    },
    [setSelectedTransactions],
  );

  const toggleSelectAll = ({ isSelected }: { isSelected: boolean }) => {
    setIsSelectAllChecked(isSelected);
    setSelectedTransactions(isSelected ? [...transactions] : []);
  };

  const getOwedPercentage = (percentage: number) => {
    const owedPercentage = 1 - percentage / 100;
    return owedPercentage;
  };

  const createSplitEntry = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const categorizedTransactions = _.groupBy(selectedTransactions, 'category_id');

    const categorizedAmounts = _.reduce(
      categorizedTransactions,
      (accum, transactions, categoryId) => {
        accum[categoryId] = _.sumBy(transactions, 'amount');
        return accum;
      },
      {} as Record<string, number>,
    );

    const owedCategorizedAmounts = _.reduce(
      categorizedAmounts,
      (accum, amount, categoryId) => {
        accum[categoryId] = Math.round(amount * getOwedPercentage(myShare));
        return accum;
      },
      {} as Record<string, number>,
    );

    const summaryTransaction: TransactionPayload = {
      account_id: iouAccountId,
      date: convertDateToString(dateToSplitCosts),
      amount: _.reduce(owedCategorizedAmounts, (sum, amt) => sum - amt, 0),
      payee_id: null,
      payee_name: null,
      category_id: null,
      memo: null,
      cleared: 'uncleared',
      approved: true,
      flag_color: null,
      import_id: null,
      subtransactions: _.map(owedCategorizedAmounts, (amount, category_id) => ({
        amount: -amount,
        payee_id: null,
        payee_name: 'Shared Costs',
        category_id,
        memo: null,
      })),
    };

    try {
      setIsIouTransactionLoading(true);
      const transaction = await createTransaction(summaryTransaction);
      if (transaction) {
        setSucceeded(true);
        setIouAccountTransactions([...iouAccountTransactions, transaction]);
        setSelectedTransactions([]);
        setIsSelectAllChecked(false);
      } else {
        displayErrorMessage(null);
      }
    } catch (error) {
      displayErrorMessage(error);
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
    if (areTransactionsLoading) {
      setSelectedTransactions([]);
      setIsSelectAllChecked(false);
    }
  }, [areTransactionsLoading]);

  const learnMoreLink = (
    <Hyperlink
      as="button"
      type="button"
      style={{ color: 'white', margin: 0 }}
      onClick={() => setActiveModal(ModalName.INSTRUCTIONS)}
    >
      Learn more
    </Hyperlink>
  );

  return isPageLoading ? (
    'Loading...'
  ) : (
    <Container>
      <Modals id={MODALS_CONTAINER_ID}>
        {activeModal === ModalName.PRIVACY_POLICY_REQUIRED && (
          <Modal onClose={closeModal} buttonText="Acknowledge">
            <PrivacyPolicy />
          </Modal>
        )}

        {activeModal === ModalName.PRIVACY_POLICY && (
          <Modal onClose={closeModal} shouldCloseOnOverlayClick shouldCloseOnEscape>
            <PrivacyPolicy />
          </Modal>
        )}

        {activeModal === ModalName.INSTRUCTIONS && (
          <Modal onClose={closeModal} shouldCloseOnOverlayClick shouldCloseOnEscape>
            <Instructions style={{ padding: '20px' }} />
          </Modal>
        )}

        {activeModal === ModalName.TRANSACTION_REVIEW && (
          <Modal
            onClose={closeModal}
            buttonText="Exit"
            shouldCloseOnOverlayClick
            shouldCloseOnEscape
          >
            <TransactionWindow
              title="Transactions in shared accounts, but not in shared categories"
              description="This list is meant to help you catch misclassified transactions. Recategorize them in YNAB as needed and then refresh the list."
              loading={areTransactionsLoading}
              shouldShowLoadingOverlay
              transactions={categoryFlags}
              containerStyle={{
                alignItems: 'unset',
              }}
              feedStyle={{
                border: 'unset',
                padding: 'unset',
                minHeight: '20vh',
                maxHeight: '50vh',
              }}
              shouldShowRefreshButton
              refreshTransactions={handleTransactionSearch}
            />
          </Modal>
        )}
      </Modals>

      <NonModalContent inert={!!activeModal}>
        {succeeded && (
          <Popup
            message="Transaction created"
            onClose={() => setSucceeded(false)}
            containerStyle={{ backgroundColor: colors.success }}
            closeButtonStyle={{ color: colors.success }}
          />
        )}

        {errorData && <ErrorPopup errorData={errorData} setErrorData={setErrorData} />}

        <AppHeader setActiveModal={setActiveModal} handleInfoClick={handleInfoClick} />

        <HelpButtonContainer>
          <Hyperlink
            as="button"
            type="button"
            onClick={() => setActiveModal(ModalName.INSTRUCTIONS)}
          >
            <InfoIcon tooltipContent="" /> Help
          </Hyperlink>
        </HelpButtonContainer>

        <TransactionSearchForm
          {...budgetData}
          selectedAccounts={selectedAccounts}
          setSelectedAccounts={setSelectedAccounts}
          selectedParentCategories={selectedParentCategories}
          setSelectedParentCategories={setSelectedParentCategories}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onSubmit={handleTransactionSearch}
          handleInfoClick={handleInfoClick}
        />

        <TransactionsTile id={TRANSACTION_SELECTION_FORM_ID}>
          <SectionHeader>Select Shared Costs</SectionHeader>

          {!areTransactionsLoading && !!categoryFlags.length && (
            <MissingTransactionsWarning>
              <WarningIcon />
              Some transactions in shared accounts were not categorized to shared categories.
              <ReviewTransactionsButton
                type="button"
                onClick={() => setActiveModal(ModalName.TRANSACTION_REVIEW)}
              >
                Review
              </ReviewTransactionsButton>
            </MissingTransactionsWarning>
          )}

          <TransactionWindowContainer>
            <TransactionWindow
              loading={areTransactionsLoading}
              transactions={transactions}
              selectedTransactions={selectedTransactions}
              transactionsSharedInOneButNotOther={accountFlags}
              toggleTransactionSelection={toggleTransactionSelection}
              toggleSelectAll={toggleSelectAll}
              isSelectAllChecked={isSelectAllChecked}
              shouldShowIcon
              isClickable
            />
          </TransactionWindowContainer>
        </TransactionsTile>

        <SectionTile style={{ alignItems: 'start' }}>
          <form style={{ display: 'contents' }}>
            <SectionHeader style={{ width: '100%' }}>Split the Costs</SectionHeader>

            <SectionContent>
              <BudgetAutocomplete
                limit={1}
                onSelectionChange={([selectedAccount]) =>
                  setIouAccountId(selectedAccount?.id || '')
                }
                placeholder="Add one"
                items={budgetData.accounts.map((acct) => ({
                  id: acct.id,
                  displayedContent: acct.name,
                  searchableText: acct.name,
                  data: acct,
                }))}
                label={'Select the "IOU" account that tracks what you are owed.'}
                labelDecoration={
                  <InfoIcon
                    tooltipContent={
                      <>
                        This account tracks what you are owed from the person sharing an account
                        with you. To create it in YNAB, click "Add Account", then "Add an Unlinked
                        Account", and nickname it something like "Owed from [person's name]." The
                        account type should be Checking, Savings, or Cash.
                      </>
                    }
                  />
                }
              />
            </SectionContent>

            <CostPercentField>
              <CostPercentLabel htmlFor="split-percentage-slider">
                Enter your share of the{' '}
                <NoWrap>
                  costs.{' '}
                  <InfoIcon
                    tooltipContent={
                      <>
                        The percentage owed to you will be subtracted from your expenses and added
                        to your &quot;IOU&quot; account, via a single YNAB transaction.{' '}
                        {learnMoreLink}
                      </>
                    }
                  />
                </NoWrap>
              </CostPercentLabel>

              <Row>
                <CostPercentSlider
                  type="range"
                  id="split-percentage-slider"
                  min="0"
                  max="100"
                  value={myShare}
                  onChange={(e) => setMyShare(Number(e.target.value))}
                />

                <NoWrap>
                  <CostPercentInput
                    type="number"
                    id="split-percentage-input"
                    min="0"
                    max="100"
                    value={myShare}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(100, Number(e.target.value)));
                      setMyShare(value);
                    }}
                  />
                  <span>%</span>
                </NoWrap>
              </Row>
            </CostPercentField>

            <Spacer />

            <DateSelector
              label="Select a transaction date."
              id="cost-split-date-selector"
              value={convertDateToString(dateToSplitCosts)}
              onChange={(value) => setDateToSplitCosts(toDate(value))}
              style={{
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'unset',
                width: 'fit-content',
              }}
            />

            <Spacer />

            <Row style={{ width: '100%' }}>
              <SplitTransactionsButton
                type="submit"
                onClick={createSplitEntry}
                disabled={isSplitTransactionDisabled}
              >
                {isIouTransactionLoading ? <Spinner /> : 'Split Costs'}
                &nbsp;
                {isSplitTransactionDisabled && (
                  <InfoIcon color="white" tooltipContent={buttonDisabledMessage} />
                )}
              </SplitTransactionsButton>
            </Row>
          </form>

          {!!iouAccountTransactions.length && (
            <TransactionWindow
              loading={isIouTransactionLoading}
              title="Your IOU Transactions:"
              transactions={iouAccountTransactions}
            />
          )}
        </SectionTile>

        <Nav setActiveModal={setActiveModal} />
      </NonModalContent>
    </Container>
  );
};

export default App;
