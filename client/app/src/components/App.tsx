import { useState, useEffect } from 'react';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import colors from '../../../shared/colors';
import { APP_MIN_WIDTH } from '../../../shared/constants';
import Instructions from '../../../shared/Instructions';
import Link from '../../../shared/Link';
import PrivacyPolicy from '../../../shared/PrivacyPolicy';
import {
  FlexColumnAllCentered,
  FlexColumnCentered,
  ScrollableArea,
} from '../../../shared/styledComponents';
import { MODALS_CONTAINER_ID } from '../constants';
import '../styles/global.css';
import {
  Account,
  BudgetData,
  ErrorData,
  ModalName,
  ParentCategory,
  TransactionGroups,
} from '../types';
import AppHeader from './AppHeader';
import CostSplittingForm from './CostSplittingForm';
import ErrorPopup from './ErrorPopup';
import FooterNav from './FooterNav';
import InfoIcon from './InfoIcon';
import Modal from './Modal';
import { LoadingSpinner } from './styledComponents';
import TransactionSearchForm from './TransactionSearchForm';
import cleanAndGroupTransactions from './utils/cleanAndGroupTransactions';
import { getFirstDateOfLastMonth, getLastDateOfLastMonth } from './utils/dateHelpers';
import { hasMessage, hasResponseAndStatus } from './utils/general';
import {
  getTransactionsSinceDate,
  getAccounts,
  getParentCategories,
} from './utils/networkRequests';

/* STYLED COMPONENTS */

const Container = styled(FlexColumnAllCentered)`
  height: 100%;
  width: 100%;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const LoadingContainer = styled(Container)`
  height: 100%;
`;

const Modals = styled.div``;

const NonModalContent = styled(FlexColumnAllCentered)`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const ScrollArea = styled(ScrollableArea)`
  --scroll-track-color: rgb(255 255 255 / 50%);
  border: unset;
  width: 100%;
`;

const MinWidthContainer = styled(FlexColumnCentered)`
  box-sizing: border-box;
  width: 100%;
  min-width: ${APP_MIN_WIDTH};
`;

const HelpButtonContainer = styled.div`
  margin: 25px 0;

  button {
    text-decoration: none;
    color: ${colors.infoIcon};
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

/* MAIN */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState<BudgetData>({ accounts: [], parentCategories: [] });
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalName | null>(
    ModalName.PRIVACY_POLICY_REQUIRED,
  );
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([]);
  const [selectedParentCategories, setSelectedParentCategories] = useState<ParentCategory[]>([]);
  const [dateRange, setDateRange] = useState({
    start: getFirstDateOfLastMonth(),
    end: getLastDateOfLastMonth(),
  });
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(false);
  const [transactionGroups, setTransactionGroups] = useState<TransactionGroups>({
    transactions: [],
    accountFlags: [],
    categoryFlags: [],
  });

  const handleInfoClick = () => setActiveModal(ModalName.INSTRUCTIONS);

  const closeModal = () => setActiveModal(null);

  const handleError = (error: unknown) => {
    setErrorData({
      status: hasResponseAndStatus(error) ? error.response.status : 0,
      message: hasMessage(error) ? error.message : 'Something went wrong',
    });
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
      handleError(error);
    }
    setAreTransactionsLoading(false);
  };

  useEffect(function onMount() {
    const loadBudgetData = async () => {
      setLoading(true);
      try {
        setBudgetData({
          accounts: await getAccounts(),
          parentCategories: await getParentCategories(),
        });
      } catch (error) {
        handleError(error);
      }
      setLoading(false);
    };

    loadBudgetData();
  }, []);

  return loading ? (
    <LoadingContainer>
      <LoadingSpinner role="progressbar" aria-label="Loading" />
    </LoadingContainer>
  ) : (
    <Container>
      <Modals id={MODALS_CONTAINER_ID}>
        {activeModal === ModalName.PRIVACY_POLICY_REQUIRED && (
          <Modal onClose={closeModal} buttonText="Acknowledge">
            <PrivacyPolicy style={{ padding: '20px' }} />
          </Modal>
        )}

        {activeModal === ModalName.PRIVACY_POLICY && (
          <Modal onClose={closeModal} shouldCloseOnOverlayClick shouldCloseOnEscape>
            <PrivacyPolicy style={{ padding: '20px' }} />
          </Modal>
        )}

        {activeModal === ModalName.INSTRUCTIONS && (
          <Modal onClose={closeModal} shouldCloseOnOverlayClick shouldCloseOnEscape>
            <Instructions style={{ padding: '20px' }} />
          </Modal>
        )}
      </Modals>

      {!activeModal && errorData && (
        <ErrorPopup errorData={errorData} setErrorData={setErrorData} />
      )}

      <NonModalContent inert={!!activeModal || isMenuOpen}>
        <AppHeader
          setActiveModal={setActiveModal}
          handleInfoClick={handleInfoClick}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        <ScrollArea>
          <MinWidthContainer>
            <HelpButtonContainer>
              <Link asButton theme="subtle" onClick={handleInfoClick}>
                <InfoIcon tooltipContent="" /> Help
              </Link>
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

            <CostSplittingForm
              {...budgetData}
              {...transactionGroups}
              loading={areTransactionsLoading}
              searchTransactions={handleTransactionSearch}
              handleInfoClick={handleInfoClick}
              handleError={handleError}
              activeModal={activeModal}
              setActiveModal={setActiveModal}
            />

            <FooterNav setActiveModal={setActiveModal} />
          </MinWidthContainer>
        </ScrollArea>
      </NonModalContent>
    </Container>
  );
}
