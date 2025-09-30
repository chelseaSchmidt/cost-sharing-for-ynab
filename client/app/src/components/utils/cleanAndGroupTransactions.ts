import negate from 'lodash/negate';
import { Moment } from 'moment';
import { Account, TransactionGroups, ParentCategory, Transaction } from '../../types';
import { isTransactionBeforeDate } from './dateHelpers';
import { toId } from './general';

interface Args {
  transactionsSinceStartDate: Transaction[];
  endDate: Moment;
  selectedAccounts: Account[];
  selectedParentCategories: ParentCategory[];
}

export default function cleanAndGroupTransactions({
  transactionsSinceStartDate,
  endDate,
  selectedAccounts,
  selectedParentCategories,
}: Args) {
  const result: TransactionGroups = { transactions: [], accountFlags: [], categoryFlags: [] };

  const validAccountIds = new Set(selectedAccounts.map(toId));
  const validCategoryIds = new Set(selectedParentCategories.flatMap(toCategories).map(toId));

  const inValidCategory = ({ category_id }: Transaction) => validCategoryIds.has(category_id);
  const inValidAccount = ({ account_id }: Transaction) => validAccountIds.has(account_id);

  const validTransactions = transactionsSinceStartDate
    .filter((t) => isTransactionBeforeDate(t, endDate) && t.approved && !isTransfer(t))
    .sort(byDateDescending);

  if (selectedParentCategories.length) {
    /* If categories selected, filter by category, and use account info to generate warnings */
    result.transactions = validTransactions.filter(inValidCategory);
    result.accountFlags = result.transactions.filter(negate(inValidAccount));
    result.categoryFlags = validTransactions.filter(inValidAccount).filter(negate(inValidCategory));
  } else {
    /* Otherwise, filter by account */
    result.transactions = validTransactions.filter(inValidAccount);
  }

  return result;
}

function isTransfer(transaction: Transaction) {
  return !!transaction.transfer_account_id;
}

function toCategories(parentCategory: ParentCategory) {
  return parentCategory.categories;
}

function byDateDescending(a: Transaction, b: Transaction) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
