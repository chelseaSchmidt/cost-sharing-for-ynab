/* eslint-disable camelcase */

import { toId } from './general';

const classifyTransactions = ({
  displayedTransactions,
  selectedAccounts,
  selectedParentCategories,
}) => {
  const sharedAccountIds = selectedAccounts.map((acct) => acct.accountId);
  const sharedCategoryIds = selectedParentCategories.length > 0
    ? selectedParentCategories
        .flatMap(({ subCategories }) => subCategories)
        .map(toId)
    : [];

  // If no parent categories selected, treat all as "in shared categories"
  if (sharedCategoryIds.length === 0) {
    return {
      transactionsInSharedCategories: displayedTransactions,
      sharedAccountErrorTransactions: [],
      sharedCategoryErrorTransactions: [],
    };
  }

  return displayedTransactions.reduce((accum, transaction) => {
    const {
      account_id,
      category_id,
    } = transaction;

    const isInSharedAccount = sharedAccountIds.includes(account_id);
    const isInSharedCategory = sharedCategoryIds.includes(category_id);
    const isInSharedAccountButNotCategory = isInSharedAccount && !isInSharedCategory;
    const isInSharedCategoryButNotAccount = isInSharedCategory && !isInSharedAccount;

    if (isInSharedCategory) accum.transactionsInSharedCategories.push(transaction);
    if (isInSharedAccountButNotCategory) accum.sharedAccountErrorTransactions.push(transaction);
    if (isInSharedCategoryButNotAccount) accum.sharedCategoryErrorTransactions.push(transaction);

    return accum;
  }, {
    transactionsInSharedCategories: [],
    sharedAccountErrorTransactions: [],
    sharedCategoryErrorTransactions: [],
  });
};

export default classifyTransactions;
