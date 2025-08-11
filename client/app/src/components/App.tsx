import { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import BudgetAutocomplete from './BudgetAutocomplete';
import DateSelector from './DateSelector';
import InfoIcon from './InfoIcon';
import TransactionWindow from './TransactionWindow';
import Confirmation from './Confirmation';
import Modal from './Modal';
import Switch from './Switch';
import Header from '../../../shared/Header';
import Nav from './Nav';
import Error from './Error';
import PrivacyPolicy from '../../../shared/PrivacyPolicy';
import Instructions from '../../../shared/Instructions';
import { SectionHeader, WarningIcon, Tooltip, Spinner, OptionButton } from './styledComponents';
import {
  getTransactionsSinceDate,
  getAccounts,
  getParentCategories,
  createSplitTransaction,
} from './utils/networkRequests';
import {
  convertDateToString,
  toDate,
  isTransactionBeforeDate,
  getFirstDateOfLastMonth,
  getLastDateOfLastMonth,
} from './utils/dateHelpers';
import classifyTransactions from './utils/classifyTransactions';
import breakpoints from '../../../shared/breakpoints';
import colors from '../../../shared/colors';
import { MenuItem } from '../../../shared/NavMenu';
import { Button, Hyperlink } from '../../../shared/styledComponents';
import '../styles/global.css';
import {
  Account,
  BudgetData,
  ClassifiedTransactions,
  DraftTransaction,
  ErrorData,
  ModalName,
  Mode,
  ParentCategory,
  Transaction,
} from '../types';

/* CONSTANTS */

const HIDDEN_CATEGORIES = ['Internal Master Category', 'Credit Card Payments', 'Hidden Categories'];
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

const PrivacyPolicyContainer = styled.div`
  padding-right: 20px;
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
`;

const Subtitle = styled.div`
  margin-bottom: 20px;
`;

const SubtitleText = styled.span`
  margin-right: 5px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const RowOrColumn = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    gap: 20px;
  }
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
  position: relative;

  @media (max-width: ${breakpoints.mobile}) {
    margin: 10px 0 0 0;
  }

  &:disabled:hover {
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
  white-space: normal;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border: 5px solid;
    border-color: #444 transparent transparent transparent;
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
  align-items: center;
  gap: 20px;
`;

const CostPercentLabel = styled.label`
  text-align: center;
`;

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

const TooltipParagraph = styled.p`
  all: unset;
  display: block;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Spacer = styled.div`
  height: 20px;
`;

/* MAIN */

const App = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(false);
  const [mode, setMode] = useState(Mode.STANDARD);
  const [budgetData, setBudgetData] = useState<BudgetData>({
    accounts: [],
    parentCategories: [],
  });
  const [transactionsStartDate, setTransactionsStartDate] = useState(getFirstDateOfLastMonth());
  const [transactionsEndDate, setTransactionsEndDate] = useState(getLastDateOfLastMonth());
  const [myShare, setMyShare] = useState(50);
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [dateToSplitCosts, setDateToSplitCosts] = useState(getLastDateOfLastMonth());
  const [classifiedTransactions, setClassifiedTransactions] = useState<ClassifiedTransactions>({
    filteredTransactions: [],
    sharedAccountErrorTransactions: [],
    sharedCategoryErrorTransactions: [],
  });
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);
  const [selectedParentCategories, setSelectedParentCategories] = useState<ParentCategory[]>([]);
  const [iouAccountId, setIouAccountId] = useState('');
  const [iouAccountTransactions, setIouAccountTransactions] = useState<Transaction[]>([]);
  const [isIouTransactionLoading, setIsIouTransactionLoading] = useState(false);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [activeModal, setActiveModal] = useState<ModalName | null>(ModalName.PRIVACY_POLICY);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const { filteredTransactions, sharedAccountErrorTransactions, sharedCategoryErrorTransactions } =
    classifiedTransactions;

  const isSplitTransactionDisabled = !selectedTransactions.length || !iouAccountId;

  const buttonDisabledMessage = !selectedTransactions.length
    ? (!iouAccountId && 'Please select shared costs and an IOU account') ||
      'Please select shared costs'
    : 'Please select an IOU account';

  const navMenuItems: MenuItem[] = [
    {
      text: 'Home',
      attributes: {
        href: '/',
      },
    },
    {
      text: 'Guide',
      onClick: () => setActiveModal(ModalName.INSTRUCTIONS),
      attributes: {
        type: 'button',
        as: 'button',
      },
    },
    {
      text: 'Privacy Policy',
      onClick: () => setActiveModal(ModalName.PRIVACY_POLICY),
      attributes: {
        type: 'button',
        as: 'button',
      },
    },
    {
      text: 'Source Code & Bug Reporting',
      attributes: {
        href: 'https://github.com/chelseaSchmidt/cost-sharing-for-ynab',
        target: '_blank',
        rel: 'noreferrer',
      },
    },
  ];

  const displayErrorMessage = (error: unknown) => {
    setErrorData({
      status:
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'status' in error.response &&
        typeof error.response.status === 'number'
          ? error.response.status
          : 0,
      message:
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : 'Something went wrong',
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

  const getClassifiedTransactions = async ({
    startDate,
    endDate,
  }: {
    startDate: moment.Moment;
    endDate: moment.Moment;
  }) => {
    const isTransactionATransfer = (transaction: Transaction) => !!transaction.transfer_account_id;

    try {
      setAreTransactionsLoading(true);
      const transactionsSinceStartDate = await getTransactionsSinceDate(startDate);

      const displayedTransactions = transactionsSinceStartDate
        .filter(
          (transaction) =>
            isTransactionBeforeDate(transaction, endDate) &&
            transaction.approved &&
            !isTransactionATransfer(transaction),
        )
        .sort((a, b) =>
          a.date && b.date ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0,
        );

      setClassifiedTransactions(
        classifyTransactions({
          displayedTransactions,
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
    setSelectedTransactions(isSelected ? [...filteredTransactions] : []);
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

    const summaryTransaction: DraftTransaction = {
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
      const transaction = await createSplitTransaction(summaryTransaction);
      if (transaction) {
        setIsConfirmationVisible(true);
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
      {activeModal && (
        <Modal
          onClose={() => setActiveModal(null)}
          buttonText={activeModal === ModalName.TRANSACTION_REVIEW ? 'Exit' : 'OK'}
          shouldCloseOnOverlayClick={activeModal !== ModalName.PRIVACY_POLICY}
        >
          {activeModal === ModalName.PRIVACY_POLICY && (
            <PrivacyPolicyContainer>
              <PrivacyPolicy />
            </PrivacyPolicyContainer>
          )}

          {activeModal === ModalName.TRANSACTION_REVIEW && (
            <TransactionWindow
              title="Transactions in shared accounts, but not in shared categories"
              description="This list is meant to help you catch misclassified transactions. Recategorize them in YNAB as needed and then refresh the list."
              loading={areTransactionsLoading}
              shouldShowLoadingOverlay
              transactions={sharedAccountErrorTransactions}
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
              refreshTransactions={() => {
                getClassifiedTransactions({
                  startDate: transactionsStartDate,
                  endDate: transactionsEndDate,
                });
              }}
            />
          )}

          {activeModal === ModalName.INSTRUCTIONS && <Instructions style={{ padding: '20px' }} />}
        </Modal>
      )}

      <NonModalContent inert={!!activeModal}>
        {isConfirmationVisible && (
          <Confirmation setIsConfirmationVisible={setIsConfirmationVisible} />
        )}

        {errorData && <Error errorData={errorData} setErrorData={setErrorData} />}

        <Header navMenuItems={navMenuItems} />

        <HelpButtonContainer>
          <Hyperlink
            as="button"
            type="button"
            onClick={() => setActiveModal(ModalName.INSTRUCTIONS)}
          >
            <InfoIcon tooltipContent="" /> Help
          </Hyperlink>
        </HelpButtonContainer>

        <SectionTile>
          <SectionHeader>Choose Accounts and Categories</SectionHeader>

          <SectionContent>
            <Subtitle>
              <SubtitleText>Select where you record shared-cost transactions.</SubtitleText>

              <InfoIcon
                tooltipContent={
                  <>
                    "Standard" is recommended for most use cases. The "Advanced" method enables
                    automatic checking for misclassified transactions, but involves changing how you
                    record transactions in YNAB. {learnMoreLink}
                  </>
                }
              />
            </Subtitle>

            <Switch
              selected={mode}
              onChange={(mode) => {
                setMode(mode);
                if (mode !== Mode.ADVANCED) {
                  setSelectedParentCategories([]);
                }
              }}
              options={[
                {
                  value: Mode.STANDARD,
                  displayedContent: (
                    <>
                      <strong>Standard:</strong>
                      <div>In specific accounts</div>
                    </>
                  ),
                },
                {
                  value: Mode.ADVANCED,
                  displayedContent: (
                    <>
                      <strong>Advanced:</strong>
                      <div>In specific accounts and categories</div>
                    </>
                  ),
                },
              ]}
            />
          </SectionContent>

          <SectionContent>
            <BudgetAutocomplete
              limit={budgetData.accounts.length}
              placeholder={selectedAccounts.length ? 'Add more' : 'Add one or more'}
              labelText="Select the YNAB accounts you use for shared costs."
              onSelectionChange={(selected) =>
                setSelectedAccounts(selected.map(({ data }) => data))
              }
              items={budgetData.accounts.map((acct) => ({
                id: acct.id,
                displayedContent: acct.name,
                searchableText: acct.name,
                data: acct,
              }))}
              label={
                <Subtitle>
                  <SubtitleText>Select the YNAB accounts you use for shared costs.</SubtitleText>
                  <InfoIcon tooltipContent="This might be one or more shared credit cards or bank accounts." />
                </Subtitle>
              }
            />
          </SectionContent>

          {mode === Mode.ADVANCED && (
            <SectionContent>
              <BudgetAutocomplete
                limit={budgetData.parentCategories.length}
                placeholder={selectedParentCategories.length ? 'Add more' : 'Add one or more'}
                labelText="Select the YNAB parent categories you use for shared costs."
                onSelectionChange={(selected) =>
                  setSelectedParentCategories(selected.map(({ data }) => data))
                }
                items={budgetData.parentCategories
                  .filter((cat) => !HIDDEN_CATEGORIES.includes(cat.name))
                  .map((cat) => ({
                    id: cat.id,
                    displayedContent: cat.name,
                    searchableText: cat.name,
                    data: cat,
                  }))}
                label={
                  <Subtitle>
                    <SubtitleText>
                      Select the YNAB parent categories you use for shared costs.
                    </SubtitleText>

                    <InfoIcon
                      tooltipContent={
                        <>
                          <TooltipParagraph>
                            Categories you select here should cumulatively include all your shared
                            costs, and each one should include only shared costs. If you mix shared
                            and non-shared transactions in the same categories, switch back to the
                            "Standard" recording method above.
                          </TooltipParagraph>

                          <TooltipParagraph>
                            Otherwise, select all parent categories where you record only shared
                            costs. If you followed the guide exactly, select the parent category
                            named "Shared Expenses". {learnMoreLink}
                          </TooltipParagraph>
                        </>
                      }
                    />
                  </Subtitle>
                }
              />
            </SectionContent>
          )}

          <SectionContent>
            <BudgetAutocomplete
              limit={1}
              onSelectionChange={([selectedAccount]) => setIouAccountId(selectedAccount?.id || '')}
              placeholder="Add one"
              labelText='Select the "IOU" account that tracks what you are owed.'
              items={budgetData.accounts.map((acct) => ({
                id: acct.id,
                displayedContent: acct.name,
                searchableText: acct.name,
                data: acct,
              }))}
              label={
                <Subtitle>
                  <SubtitleText>
                    Select the &quot;IOU&quot; account that tracks what you are owed.
                  </SubtitleText>

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
                </Subtitle>
              }
            />
          </SectionContent>

          <SectionContent>
            <Subtitle>
              <SubtitleText>Select transaction date range.</SubtitleText>
              <InfoIcon tooltipContent="This will limit transactions in your view to the specified date range." />
            </Subtitle>

            <form>
              <RowOrColumn>
                <DateSelector
                  label="Start date:"
                  inputId="transactions-start-date"
                  inputValue={convertDateToString(transactionsStartDate)}
                  inputStyle={{ maxWidth: '200px' }}
                  onChange={(value) => setTransactionsStartDate(toDate(value))}
                />

                <DateSelector
                  label="End date:"
                  inputId="transactions-end-date"
                  inputValue={convertDateToString(transactionsEndDate)}
                  inputStyle={{ maxWidth: '200px' }}
                  onChange={(value) => setTransactionsEndDate(toDate(value, false))}
                />
              </RowOrColumn>
            </form>
          </SectionContent>

          <Button
            type="button"
            onClick={() => {
              getClassifiedTransactions({
                startDate: transactionsStartDate,
                endDate: transactionsEndDate,
              });
              document.getElementById('transaction-container')?.scrollIntoView(true);
            }}
          >
            Show Transactions
          </Button>
        </SectionTile>

        <TransactionsTile id="transaction-container">
          <SectionHeader>Select Shared Costs</SectionHeader>

          {!areTransactionsLoading && !!sharedAccountErrorTransactions.length && (
            <MissingTransactionsWarning>
              <WarningIcon>!</WarningIcon>
              Some transactions in shared accounts were not categorized to shared expense
              categories.
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
              transactions={filteredTransactions}
              selectedTransactions={selectedTransactions}
              transactionsSharedInOneButNotOther={sharedCategoryErrorTransactions}
              toggleTransactionSelection={toggleTransactionSelection}
              toggleSelectAll={toggleSelectAll}
              isSelectAllChecked={isSelectAllChecked}
              shouldShowIcon
              isClickable
            />
          </TransactionWindowContainer>
        </TransactionsTile>

        <SectionTile>
          <form style={{ display: 'contents' }}>
            <SectionHeader>Split the Costs</SectionHeader>

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
              inputId="cost-split-date-selector"
              inputValue={convertDateToString(dateToSplitCosts)}
              onChange={(value) => setDateToSplitCosts(toDate(value))}
              style={{
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'unset',
                width: 'fit-content',
              }}
            />

            <Spacer />

            <Row>
              <SplitTransactionsButton
                type="submit"
                onClick={createSplitEntry}
                disabled={isSplitTransactionDisabled}
              >
                {isIouTransactionLoading ? <Spinner /> : 'Split Costs'}
                &nbsp;
                {isSplitTransactionDisabled && <InfoIcon color="white" />}
                <ButtonDisabledPopup>{buttonDisabledMessage}</ButtonDisabledPopup>
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
