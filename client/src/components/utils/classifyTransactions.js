/* eslint-disable camelcase */
const classifyTransactions = ({
  displayedTransactions,
  sharedAccounts,
  sharedParentCategories,
  splitAccountId,
}) => {
  const sharedAccountIds = sharedAccounts.map((acct) => acct.accountId);
  const sharedCategoryIds = sharedParentCategories
    .flatMap(({ subCategories }) => subCategories)
    .map(({ id }) => id);

  return displayedTransactions.reduce((accum, transaction) => {
    const {
      account_id,
      category_id,
    } = transaction;

    const isInSharedAccount = sharedAccountIds.includes(account_id);
    const isInSharedCategory = sharedCategoryIds.includes(category_id);
    const isInSharedAccountButNotCategory = isInSharedAccount && !isInSharedCategory;
    const isInSharedCategoryButNotAccount = isInSharedCategory && !isInSharedAccount;

    if (splitAccountId === account_id) accum.iouAccountTransactions.push(transaction);
    if (isInSharedAccount) accum.transactionsInSharedBankAccounts.push(transaction);
    if (isInSharedCategory) accum.transactionsInSharedCategories.push(transaction);
    if (isInSharedAccountButNotCategory) accum.sharedAccountErrorTransactions.push(transaction);
    if (isInSharedCategoryButNotAccount) accum.sharedCategoryErrorTransactions.push(transaction);

    return accum;
  }, {
    transactionsInSharedBankAccounts: [],
    transactionsInSharedCategories: [],
    sharedAccountErrorTransactions: [],
    sharedCategoryErrorTransactions: [],
    iouAccountTransactions: [],
  });
};

export default classifyTransactions;
