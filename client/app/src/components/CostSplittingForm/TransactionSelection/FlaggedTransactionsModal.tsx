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
    <Modal
      onClose={exit}
      buttonText="Exit"
      shouldCloseOnOverlayClick
      shouldCloseOnEscape
      shouldDisableScroll
      style={{ height: 'fit-content', maxHeight: 'calc(100vh - 60px)' }}
    >
      <TransactionWindow
        title="Transactions in shared accounts, but not in shared categories"
        subtitle="This list can help you catch misclassified transactions. Recategorize them in YNAB as needed and then refresh the list to continue reviewing."
        loading={loading}
        transactions={transactions}
        containerStyle={{ padding: '15px', alignItems: 'unset' }}
        feedStyle={{ border: 'unset' }}
        refreshTransactions={refresh}
      />
    </Modal>
  );
}
