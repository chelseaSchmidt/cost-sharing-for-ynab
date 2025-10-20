import { useEffect, useState } from 'react';
import { MixedTransaction, ModalName, TransactionGroups } from '../../types';
import { toId } from '../utils/general';
import IouTransactionParams from './IouTransactionParams';
import TransactionSelection from './TransactionSelection';

interface Props extends TransactionGroups {
  loading: boolean;
  searchTransactions: () => void;
  accountId: string;
  handleInfoClick: () => void;
  handleError: (e: unknown) => void;
  activeModal: ModalName | null;
  setActiveModal: (modalName: ModalName | null) => void;
}

export default function CostSplittingForm({
  loading,
  transactions,
  accountFlags,
  categoryFlags,
  searchTransactions,
  accountId,
  handleInfoClick,
  handleError,
  activeModal,
  setActiveModal,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const resetSelections = () => {
    setSelectedIds(new Set());
    setIsSelectAllChecked(false);
  };

  const toggleSelectAll = (isSelected: boolean) => {
    setIsSelectAllChecked(isSelected);
    setSelectedIds(isSelected ? new Set(transactions.map(toId)) : new Set());
  };

  const toggleTransaction = (transaction: MixedTransaction) => {
    setSelectedIds((previousIds) => {
      const newIds = new Set(previousIds);
      newIds[previousIds.has(transaction.id) ? 'delete' : 'add'](transaction.id);
      return newIds;
    });
  };

  useEffect(() => {
    if (loading) resetSelections();
  }, [loading]);

  return (
    <form style={{ display: 'contents' }}>
      <TransactionSelection
        loading={loading}
        transactions={transactions}
        selectedIds={selectedIds}
        accountFlags={accountFlags}
        categoryFlags={categoryFlags}
        toggleTransaction={toggleTransaction}
        toggleSelectAll={toggleSelectAll}
        isSelectAllChecked={isSelectAllChecked}
        refresh={searchTransactions}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />

      <IouTransactionParams
        accountId={accountId}
        transactions={transactions}
        selectedIds={selectedIds}
        handleInfoClick={handleInfoClick}
        handleError={handleError}
        resetForm={resetSelections}
      />
    </form>
  );
}
