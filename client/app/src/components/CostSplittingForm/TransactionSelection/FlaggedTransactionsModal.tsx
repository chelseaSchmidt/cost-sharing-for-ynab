import { Transaction } from '../../../types';
import Modal from '../../Modal';
import TransactionWindow from '../TransactionWindow';

interface Props {
  transactions: Transaction[];
  loading: boolean;
  refresh: () => void;
  exit: () => void;
}

export default function FlaggedTransactionsModal({ transactions, loading, refresh, exit }: Props) {
  return (
    <Modal onClose={exit} buttonText="Exit" shouldCloseOnOverlayClick shouldCloseOnEscape>
      <TransactionWindow
        title="Transactions in shared accounts, but not in shared categories"
        description="This list is meant to help you catch misclassified transactions. Recategorize them in YNAB as needed and then refresh the list."
        loading={loading}
        shouldShowLoadingOverlay
        transactions={transactions}
        containerStyle={{ alignItems: 'unset' }}
        feedStyle={{ border: 'unset', padding: 'unset', minHeight: '20vh', maxHeight: '50vh' }}
        shouldShowRefreshButton
        refreshTransactions={refresh}
      />
    </Modal>
  );
}
