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

    const isTransactionInSharedAccount = sharedAccountIds.includes(account_id);
    const isTransactionInSharedCategory = sharedCategoryIds.includes(category_id);
    const isTransactionSharedInOneButNotOther = (
      (isTransactionInSharedAccount && !isTransactionInSharedCategory)
      || (!isTransactionInSharedAccount && isTransactionInSharedCategory)
    );

    if (splitAccountId === account_id) accum.iouAccountTransactions.push(transaction);
    if (isTransactionInSharedAccount) accum.transactionsInSharedBankAccounts.push(transaction);
    if (isTransactionInSharedCategory) accum.transactionsInSharedCategories.push(transaction);
    if (isTransactionSharedInOneButNotOther) {
      accum.transactionsSharedInOneButNotOther.push(transaction);
    }
    return accum;
  }, {
    transactionsInSharedBankAccounts: [],
    transactionsInSharedCategories: [],
    transactionsSharedInOneButNotOther: [],
    iouAccountTransactions: [],
  });
};

export default classifyTransactions;
