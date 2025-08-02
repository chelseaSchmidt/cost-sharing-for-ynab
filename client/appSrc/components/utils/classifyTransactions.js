/* eslint-disable camelcase */

import { toId } from './general';

const classifyTransactions = ({
  displayedTransactions,
  selectedAccounts,
  selectedParentCategories,
}) => {
  const sharedAccountIds = selectedAccounts.map((acct) => acct.accountId);
  const sharedCategoryIds = selectedParentCategories
    .flatMap(({ subCategories }) => subCategories)
    .map(toId);

  // filter by account if no categories selected
  if (!sharedCategoryIds.length) {
    return {
      filteredTransactions: displayedTransactions.filter(({ account_id }) => {
        return sharedAccountIds.includes(account_id);
      }),
      sharedAccountErrorTransactions: [],
      sharedCategoryErrorTransactions: [],
    };
  }

  // otherwise, filter by category, and use account info to generate warnings
  return displayedTransactions.reduce((accum, transaction) => {
    const {
      account_id,
      category_id,
    } = transaction;

    const isInSharedAccount = sharedAccountIds.includes(account_id);
    const isInSharedCategory = sharedCategoryIds.includes(category_id);
    const isInSharedAccountButNotCategory = isInSharedAccount && !isInSharedCategory;
    const isInSharedCategoryButNotAccount = isInSharedCategory && !isInSharedAccount;

    if (isInSharedCategory) accum.filteredTransactions.push(transaction);
    if (isInSharedAccountButNotCategory) accum.sharedAccountErrorTransactions.push(transaction);
    if (isInSharedCategoryButNotAccount) accum.sharedCategoryErrorTransactions.push(transaction);

    return accum;
  }, {
    filteredTransactions: [],
    sharedAccountErrorTransactions: [],
    sharedCategoryErrorTransactions: [],
  });
};

export default classifyTransactions;
