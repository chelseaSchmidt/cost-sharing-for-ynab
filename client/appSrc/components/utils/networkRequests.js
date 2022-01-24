import axios from 'axios';

const getToken = () => {
  const url = window.location.href;
  const tokenStart = '#access_token=';
  const tokenEnd = '&';
  const start = url.indexOf(tokenStart);
  if (start === -1) {
    return '';
  }
  const end = url.indexOf(tokenEnd, start);
  return url.slice(start + tokenStart.length, end);
};

export const getTransactionsSinceDate = async (sinceDate) => {
  const result = await axios({
    method: 'get',
    headers: { Authorization: `Bearer ${getToken()}` },
    url: 'https://api.youneedabudget.com/v1/budgets/default/transactions',
    params: {
      since_date: `${sinceDate}`,
    },
  });
  return result?.data.data.transactions;
};

export const getAccounts = async () => {
  const result = await axios({
    method: 'get',
    headers: { Authorization: `Bearer ${getToken()}` },
    url: 'https://api.youneedabudget.com/v1/budgets/default/accounts',
  });
  return result?.data.data.accounts.filter(({ closed }) => !closed);
};

export const getParentCategories = async () => {
  const result = await axios({
    method: 'get',
    headers: { Authorization: `Bearer ${getToken()}` },
    url: 'https://api.youneedabudget.com/v1/budgets/default/categories',
  });
  return result?.data.data.category_groups.filter(({ hidden }) => !hidden);
};

export const createSplitTransaction = async (transaction) => {
  const result = await axios({
    method: 'post',
    headers: { Authorization: `Bearer ${getToken()}` },
    url: 'https://api.youneedabudget.com/v1/budgets/default/transactions',
    data: { transaction },
  });
  return result?.data.data.transaction;
};
