/* eslint-disable camelcase */

import { toId } from './general';

const classifyTransactions = ({
  transactions,
  selectedAccounts,
  selectedParentCategories,
  startDate,
  endDate,
  isTransactionBeforeDate,
}) => {
  const sharedAccountIds = selectedAccounts.map((acct) => acct.accountId);
  const sharedCategoryIds = selectedParentCategories.length > 0
    ? selectedParentCategories
        .flatMap(({ subCategories }) => subCategories)
        .map(toId)
    : [];

  const isTransactionATransfer = (transaction) => !!transaction.transfer_account_id;

  const filtered = transactions.filter((transaction) =>
    isTransactionBeforeDate(transaction, endDate) &&
    transaction.approved &&
    !isTransactionATransfer(transaction)
  );

  return filtered.reduce((accum, transaction) => {
    const { account_id, category_id } = transaction;
    const isInSharedAccount = sharedAccountIds.includes(account_id);
    const isInSharedCategory = sharedCategoryIds.includes(category_id);

    if (sharedCategoryIds.length === 0) {
      if (isInSharedAccount) accum.filteredTransactions.push(transaction);
    } else if (isInSharedCategory) {
      accum.filteredTransactions.push(transaction);
      if (!isInSharedAccount) accum.sharedCategoryErrorTransactions.push(transaction);
    } else if (isInSharedAccount) {
      accum.sharedAccountErrorTransactions.push(transaction);
    }

    return accum;
  }, {
    filteredTransactions: [],
    sharedAccountErrorTransactions: [],
    sharedCategoryErrorTransactions: [],
  });
};

export default classifyTransactions;
