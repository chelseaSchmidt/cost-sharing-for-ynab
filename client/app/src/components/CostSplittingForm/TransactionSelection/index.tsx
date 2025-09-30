import { useCallback } from 'react';
import styled from 'styled-components';
import breakpoints from '../../../../../shared/breakpoints';
import { Button } from '../../../../../shared/styledComponents';
import { TRANSACTION_SELECTION_FORM_ID } from '../../../constants';
import { ModalName, Transaction } from '../../../types';
import { SectionHeader, SectionTile } from '../../styledComponents';
import WarningIcon from '../WarningIcon';
import TransactionWindow from '../../TransactionWindow';

const TILE_X_PADDING_LG = 75;
const TILE_X_PADDING_SM = 30;
const TILE_X_PADDING_XS = 10;

const TransactionsTile = styled(SectionTile)`
  max-height: 92vh;
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

const MissingTransactionsWarning = styled.div`
  display: flex;
  align-items: center;
  color: red;
  margin-bottom: 20px;
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

interface Props {
  loading: boolean;
  transactions: Transaction[];
  selectedTransactions: Transaction[];
  setSelectedTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  accountFlags: Transaction[];
  categoryFlags: Transaction[];
  toggleSelectAll: ({ isSelected }: { isSelected: boolean }) => void;
  isSelectAllChecked: boolean;
  setActiveModal: (modalName: ModalName | null) => void;
}

export default function TransactionSelection({
  loading,
  transactions,
  selectedTransactions,
  setSelectedTransactions,
  accountFlags,
  categoryFlags,
  toggleSelectAll,
  isSelectAllChecked,
  setActiveModal,
}: Props) {
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

  return (
    <TransactionsTile id={TRANSACTION_SELECTION_FORM_ID}>
      <SectionHeader>Select Shared Costs</SectionHeader>

      {!loading && !!categoryFlags.length && (
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
          loading={loading}
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
  );
}
