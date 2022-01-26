import moment from 'moment';

const DATE_STRING_FORMAT = 'YYYY-MM-DD';

export const convertDateToString = (date) => (
  moment(date).format(DATE_STRING_FORMAT)
);

export const convertStringToDate = (string, isStartOfDay = true) => (
  isStartOfDay
    ? moment(string, DATE_STRING_FORMAT)
    : moment(string, DATE_STRING_FORMAT).set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    })
);

export const isTransactionBeforeDate = (transaction, endDate) => (
  convertStringToDate(transaction.date).diff(endDate) < 0
);

export const getFirstDateOfLastMonth = () => (
  moment().subtract(1, 'month').startOf('month')
);

export const getLastDateOfLastMonth = () => (
  moment().subtract(1, 'month').endOf('month')
);
