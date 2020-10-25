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

export const getAllTransactions = (sinceDate) => (
  axios({
    method: 'get',
    headers: { Authorization: `Bearer ${getToken()}` },
    url: 'https://api.youneedabudget.com/v1/budgets/default/transactions',
    params: {
      since_date: `${sinceDate}`,
    },
  })
);

export const getAccounts = () => (
  axios({
    method: 'get',
    headers: { Authorization: `Bearer ${getToken()}` },
    url: 'https://api.youneedabudget.com/v1/budgets/default/accounts',
  })
);

export const getCategories = () => (
  axios({
    method: 'get',
    headers: { Authorization: `Bearer ${getToken()}` },
    url: 'https://api.youneedabudget.com/v1/budgets/default/categories',
  })
);

export const createSplitTransaction = (transaction) => (
  axios({
    method: 'post',
    headers: { Authorization: `Bearer ${getToken()}` },
    url: 'https://api.youneedabudget.com/v1/budgets/default/transactions',
    data: { transaction },
  })
);
