import moment, { Moment } from 'moment';
import { Transaction } from '../../types';

const DATE_STRING_FORMAT = 'YYYY-MM-DD';

export const convertDateToString = (date: moment.Moment) => moment(date).format(DATE_STRING_FORMAT);

export const toDate = (value: string | number, isStartOfDay = true) =>
  isStartOfDay
    ? moment(value, DATE_STRING_FORMAT)
    : moment(value, DATE_STRING_FORMAT).set({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
      });

export const isTransactionBeforeDate = (transaction: Transaction, endDate: Moment) =>
  toDate(transaction.date).diff(endDate) < 0;

export const getFirstDateOfLastMonth = () => moment().subtract(1, 'month').startOf('month');

export const getLastDateOfLastMonth = () => moment().subtract(1, 'month').endOf('month');
