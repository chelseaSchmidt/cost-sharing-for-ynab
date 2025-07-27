/* eslint-disable camelcase */

import { toId } from './general';

const classifyTransactions = ({
  transactions,
  selectedAccounts,
  selectedParentCategories,
  endDate,
  isTransactionBeforeDate,
  isTransactionATransfer,
}) => {
  const sharedAccountIds = selectedAccounts.map((acct) => acct.accountId);
  const sharedCategoryIds = selectedParentCategories.length > 0
    ? selectedParentCategories
        .flatMap(({ subCategories }) => subCategories)
        .map(toId)
    : [];

  let displayedTransactions;
  if (selectedParentCategories.length === 0) {
    displayedTransactions = transactions.filter((transaction) => (
      isTransactionBeforeDate(transaction, endDate)
      && transaction.approved
      && !isTransactionATransfer(transaction)
      && sharedAccountIds.includes(transaction.account_id)
    )).sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    displayedTransactions = transactions.filter((transaction) => (
      isTransactionBeforeDate(transaction, endDate)
      && transaction.approved
      && !isTransactionATransfer(transaction)
      && sharedCategoryIds.includes(transaction.category_id)
    )).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (sharedCategoryIds.length === 0) {
    return {
      filteredTransactions: displayedTransactions,
      sharedAccountErrorTransactions: [],
      sharedCategoryErrorTransactions: [],
    };
  }

  return displayedTransactions.reduce((accum, transaction) => {
    const { account_id, category_id } = transaction;

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
