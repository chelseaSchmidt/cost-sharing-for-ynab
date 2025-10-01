import { useState, useEffect } from 'react';
import _ from 'lodash';
import { Account, ModalName, Transaction } from '../../types';
import { toId } from '../utils/general';
import IouTransactionParams from './IouTransactionParams';
import TransactionSelection from './TransactionSelection';

interface Props {
  loading: boolean;
  transactions: Transaction[];
  accountFlags: Transaction[];
  categoryFlags: Transaction[];
  searchTransactions: () => void;
  accounts: Account[];
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
  accounts,
  handleError,
  activeModal,
  setActiveModal,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const resetSelections = () => {
    setSelectedIds(new Set());
    setIsSelectAllChecked(false);
  };

  const toggleSelectAll = (isSelected: boolean) => {
    setIsSelectAllChecked(isSelected);
    setSelectedIds(isSelected ? new Set(transactions.map(toId)) : new Set());
  };

  const toggleTransaction = (transaction: Transaction) => {
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
    <>
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
        accounts={accounts}
        transactions={transactions}
        selectedIds={selectedIds}
        handleError={handleError}
        setActiveModal={setActiveModal}
        resetForm={resetSelections}
      />
    </>
  );
}
