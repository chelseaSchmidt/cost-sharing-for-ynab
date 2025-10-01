import { useState, useEffect } from 'react';
import styled from 'styled-components';
import breakpoints from '../../../shared/breakpoints';
import colors from '../../../shared/colors';
import Instructions from '../../../shared/Instructions';
import PrivacyPolicy from '../../../shared/PrivacyPolicy';
import { Hyperlink } from '../../../shared/styledComponents';
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
import { FlexColumnAllCentered, LoadingSpinner } from './styledComponents';
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
  width: 100%;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const LoadingContainer = styled(Container)`
  height: 100vh;
`;

const Modals = styled.div``;

const NonModalContent = styled(FlexColumnAllCentered)`
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

/* MAIN */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [budgetData, setBudgetData] = useState<BudgetData>({ accounts: [], parentCategories: [] });
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
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
      </Modals>

      <NonModalContent inert={!!activeModal}>
        <AppHeader setActiveModal={setActiveModal} handleInfoClick={handleInfoClick} />

        <HelpButtonContainer>
          <Hyperlink as="button" type="button" onClick={handleInfoClick}>
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

        {errorData && <ErrorPopup errorData={errorData} setErrorData={setErrorData} />}
      </NonModalContent>
    </Container>
  );
}
