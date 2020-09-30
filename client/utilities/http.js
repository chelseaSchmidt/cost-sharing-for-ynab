import axios from 'axios';
import {
  token,
  budgetId,
  ccId,
  dueToFromId,
} from '../../identifiers';

export const getBankTransactions = (sinceDate) => (
  axios({
    method: 'get',
    headers: { Authorization: `Bearer ${token}` },
    url: `https://api.youneedabudget.com/v1/budgets/${budgetId}/accounts/${ccId}/transactions`,
    params: {
      since_date: `${sinceDate}`,
    },
  })
);

export const getAllTransactions = (sinceDate) => (
  axios({
    method: 'get',
    headers: { Authorization: `Bearer ${token}` },
    url: `https://api.youneedabudget.com/v1/budgets/${budgetId}/transactions`,
    params: {
      since_date: `${sinceDate}`,
    },
  })
);

export const getDTFTransactions = (sinceDate) => (
  axios({
    method: 'get',
    headers: { Authorization: `Bearer ${token}` },
    url: `https://api.youneedabudget.com/v1/budgets/${budgetId}/accounts/${dueToFromId}/transactions`,
    params: {
      since_date: `${sinceDate}`,
    },
  })
);

export const getAccounts = () => (
  axios({
    method: 'get',
    headers: { Authorization: `Bearer ${token}` },
    url: `https://api.youneedabudget.com/v1/budgets/${budgetId}/accounts`,
  })
);

export const getCategories = () => (
  axios({
    method: 'get',
    headers: { Authorization: `Bearer ${token}` },
    url: `https://api.youneedabudget.com/v1/budgets/${budgetId}/categories`,
  })
);

export const createSplitTransaction = (transaction) => (
  axios({
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    url: `https://api.youneedabudget.com/v1/budgets/${budgetId}/transactions`,
    data: { transaction },
  })
);
