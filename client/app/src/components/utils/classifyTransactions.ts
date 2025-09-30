import { Account, ParentCategory, Transaction, TransactionGroups } from '../../types';
import { toId } from './general';

interface Args {
  displayedTransactions: Transaction[];
  selectedAccounts: Account[];
  selectedParentCategories: ParentCategory[];
}

const classifyTransactions = ({
  displayedTransactions,
  selectedAccounts,
  selectedParentCategories,
}: Args): TransactionGroups => {
  const sharedAccountIds = selectedAccounts.map((acct) => acct.id);
  const sharedCategoryIds = selectedParentCategories
    .flatMap(({ categories }) => categories)
    .map(toId);

  // filter by account if no categories selected
  if (!sharedCategoryIds.length) {
    return {
      transactions: displayedTransactions.filter(({ account_id }) => {
        return sharedAccountIds.includes(account_id);
      }),
      accountFlags: [],
      categoryFlags: [],
    };
  }

  // otherwise, filter by category, and use account info to generate warnings
  return displayedTransactions.reduce<TransactionGroups>(
    (accum, transaction) => {
      const { account_id, category_id } = transaction;

      const isInSharedAccount = sharedAccountIds.includes(account_id);
      const isInSharedCategory = sharedCategoryIds.includes(category_id);
      const isInSharedAccountButNotCategory = isInSharedAccount && !isInSharedCategory;
      const isInSharedCategoryButNotAccount = isInSharedCategory && !isInSharedAccount;

      if (isInSharedCategory) accum.transactions.push(transaction);
      if (isInSharedAccountButNotCategory) accum.accountFlags.push(transaction);
      if (isInSharedCategoryButNotAccount) accum.categoryFlags.push(transaction);

      return accum;
    },
    {
      transactions: [],
      accountFlags: [],
      categoryFlags: [],
    },
  );
};

export default classifyTransactions;
