import negate from 'lodash/negate';
import { Moment } from 'moment';
import {
  Account,
  Category,
  MixedTransaction,
  ParentCategory,
  ProcessedSubTransaction,
  SubTransaction,
  Transaction,
  TransactionGroups,
} from '../../types';
import { isTransactionBeforeDate } from './dateHelpers';
import { toId } from './general';

interface Args {
  transactionsSinceStartDate: Transaction[];
  endDate: Moment;
  selectedAccounts: Account[];
  selectedParentCategories: ParentCategory[];
  iouAccountId: string;
}

export default function cleanAndGroupTransactions({
  transactionsSinceStartDate,
  endDate,
  selectedAccounts,
  selectedParentCategories,
  iouAccountId,
}: Args) {
  const result: TransactionGroups = { transactions: [], accountFlags: [], categoryFlags: [] };

  const accountIds = new Set(selectedAccounts.map(toId));
  const categoryIds = new Set(selectedParentCategories.flatMap(toCategories).map(toId));

  const inCategory = ({ category_id }: MixedTransaction) => categoryIds.has(category_id || '');
  const inAccount = ({ account_id }: MixedTransaction) => accountIds.has(account_id);

  const availableTransactions = transactionsSinceStartDate
    .filter((t) => isTransactionBeforeDate(t, endDate) && t.approved && !isTransfer(t))
    .flatMap<MixedTransaction>((t) => (isSingleTransaction(t) ? t : processSubTransactions(t)))
    .sort(byDateDescending);

  if (selectedParentCategories.length) {
    /* If categories selected, filter by category, and use account info to generate warnings */
    result.transactions = availableTransactions
      .filter(inCategory)
      .filter((t) => t.account_id !== iouAccountId);

    result.accountFlags = result.transactions.filter(negate(inAccount));
    result.categoryFlags = availableTransactions.filter(inAccount).filter(negate(inCategory));
  } else {
    /* Otherwise, filter by account */
    result.transactions = availableTransactions.filter(inAccount);
  }

  return result;
}

function isTransfer(transaction: Transaction | SubTransaction): boolean {
  return !!transaction.transfer_account_id;
}

function toCategories(parentCategory: ParentCategory): Category[] {
  return parentCategory.categories;
}

function byDateDescending(a: MixedTransaction, b: MixedTransaction) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function isSingleTransaction(transaction: Transaction): boolean {
  return !transaction.subtransactions.length;
}

function processSubTransactions(transaction: Transaction): ProcessedSubTransaction[] {
  return transaction.subtransactions
    .filter(negate(isTransfer))
    .filter((subT) => subT.category_id)
    .map((subT) => ({
      ...subT,
      date: transaction.date,
      account_name: transaction.account_name,
      account_id: transaction.account_id,
      isSub: true,
    }));
}
