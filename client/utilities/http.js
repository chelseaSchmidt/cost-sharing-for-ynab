import axios from 'axios';
import {
  token,
  budgetId,
} from '../../identifiers';

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
