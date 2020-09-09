import axios from 'axios';
import {
  token,
  budgetId,
  ccId,
  dueToFromId,
} from '../../identifiers';

export const getCCTransactions = (sinceDate) => (
  axios({
    method: 'get',
    headers: { Authorization: `Bearer ${token}` },
    url: `https://api.youneedabudget.com/v1/budgets/${budgetId}/accounts/${ccId}/transactions`,
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

export const createSplitTransaction = (transaction) => (
  axios({
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    url: `https://api.youneedabudget.com/v1/budgets/${budgetId}/transactions`,
    data: { transaction },
  })
);
