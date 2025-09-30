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
  accounts: Account[];
  handleError: (e: unknown) => void;
  setActiveModal: (modalName: ModalName | null) => void;
}

export default function CostSplittingForm({
  loading,
  transactions,
  accountFlags,
  categoryFlags,
  accounts,
  handleError,
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
