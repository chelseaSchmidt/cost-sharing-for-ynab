import { useState, useEffect } from 'react';
import _ from 'lodash';
import { Account, ModalName, Transaction } from '../../types';
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
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const toggleSelectAll = ({ isSelected }: { isSelected: boolean }) => {
    setIsSelectAllChecked(isSelected);
    setSelectedTransactions(isSelected ? [...transactions] : []);
  };

  useEffect(() => {
    if (loading) {
      setSelectedTransactions([]);
      setIsSelectAllChecked(false);
    }
  }, [loading]);

  return (
    <>
      <TransactionSelection
        loading={loading}
        transactions={transactions}
        selectedTransactions={selectedTransactions}
        setSelectedTransactions={setSelectedTransactions}
        accountFlags={accountFlags}
        categoryFlags={categoryFlags}
        toggleSelectAll={toggleSelectAll}
        isSelectAllChecked={isSelectAllChecked}
        refresh={searchTransactions}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />

      <IouTransactionParams
        accounts={accounts}
        selectedTransactions={selectedTransactions}
        setSelectedTransactions={setSelectedTransactions}
        handleError={handleError}
        setActiveModal={setActiveModal}
        setIsSelectAllChecked={setIsSelectAllChecked}
      />
    </>
  );
}
