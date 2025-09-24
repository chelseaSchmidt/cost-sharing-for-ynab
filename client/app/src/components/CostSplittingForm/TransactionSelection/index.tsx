import styled from 'styled-components';
import breakpoints from '../../../../../shared/breakpoints';
import colors from '../../../../../shared/colors';
import { HEADER_MAX_HEIGHT } from '../../../../../shared/Header';
import { Button } from '../../../../../shared/styledComponents';
import { TRANSACTION_SELECTION_FORM_ID } from '../../../constants';
import { ModalName, Transaction } from '../../../types';
import { FlexRowAllCentered, SectionHeader, SectionTile } from '../../styledComponents';
import TransactionWindow from '../TransactionWindow';
import WarningIcon from '../WarningIcon';
import FlaggedTransactionsModal from './FlaggedTransactionsModal';

const Container = styled(SectionTile)`
  max-height: calc(100vh - ${HEADER_MAX_HEIGHT}px - 20px);
  min-height: 400px;
  padding-left: 25px;
  padding-right: 25px;

  @media (max-width: ${breakpoints.tiny}) {
    padding-left: 5px;
    padding-right: 5px;
  }
`;

const Alert = styled(FlexRowAllCentered)`
  margin-bottom: 15px;
  border-left: 3px solid red;
  border-radius: 2px 5px 5px 2px;
  padding: 10px 20px;
  gap: 10px;
  background: ${colors.errorLight};
  color: ${colors.error};

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    padding: 20px;
  }
`;

const ReviewButton = styled(Button)`
  background: ${colors.error};

  &:hover {
    background: ${colors.errorHover};
  }

  &:active {
    background: ${colors.errorActive};
  }
`;

interface Props {
  loading: boolean;
  transactions: Transaction[];
  selectedIds: Set<string | number>;
  accountFlags: Transaction[];
  categoryFlags: Transaction[];
  toggleSelectAll: (isSelected: boolean) => void;
  isSelectAllChecked: boolean;
  toggleTransaction: (transaction: Transaction) => void;
  refresh: () => void;
  activeModal: ModalName | null;
  setActiveModal: (modalName: ModalName | null) => void;
}

export default function TransactionSelection({
  loading,
  transactions,
  selectedIds,
  accountFlags,
  categoryFlags,
  toggleSelectAll,
  isSelectAllChecked,
  toggleTransaction,
  refresh,
  activeModal,
  setActiveModal,
}: Props) {
  return (
    <Container id={TRANSACTION_SELECTION_FORM_ID}>
      <SectionHeader>Select Shared Costs</SectionHeader>

      {!loading && !!categoryFlags.length && (
        <Alert>
          <FlexRowAllCentered>
            <WarningIcon />
            Some transactions in shared accounts were not categorized to shared categories.
          </FlexRowAllCentered>

          <ReviewButton type="button" onClick={() => setActiveModal(ModalName.TRANSACTION_REVIEW)}>
            Review
          </ReviewButton>
        </Alert>
      )}

      <TransactionWindow
        loading={loading}
        transactions={transactions}
        accountFlags={accountFlags}
        formControlProps={{ selectedIds, isSelectAllChecked, toggleTransaction, toggleSelectAll }}
      />

      {activeModal === ModalName.TRANSACTION_REVIEW && (
        <FlaggedTransactionsModal
          transactions={categoryFlags}
          loading={loading}
          refresh={refresh}
          exit={() => setActiveModal(null)}
        />
      )}
    </Container>
  );
}
