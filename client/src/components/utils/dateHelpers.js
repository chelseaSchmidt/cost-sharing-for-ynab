export const getFiveDaysAgo = () => {
  const day = new Date();
  const fiveDaysAgo = new Date(day.setDate(day.getDate() - 5));
  fiveDaysAgo.setHours(0, 0, 0, 0);
  return fiveDaysAgo;
};

export const convertDateToString = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const convertStringToDate = (string, isStartOfDay = true) => {
  // yyyy-mm-dd
  const month = Number(string.slice(5, 7));
  const day = Number(string.slice(8));
  const year = Number(string.slice(0, 4));

  // warning: set date before setting month in case current month doesn't contain the date
  // (e.g. it's the 31st today and we try to set it to October)
  const date = new Date();
  date.setDate(day);
  date.setMonth(month - 1);
  date.setFullYear(year);

  if (isStartOfDay) {
    date.setHours(0, 0, 0, 0);
  } else {
    date.setHours(23, 59, 59, 999);
  }

  return date;
};

export const isDateBeforeEndDate = (dateString, endDate) => {
  // yyyy-mm-dd
  const date = convertStringToDate(dateString);
  return date < endDate;
};
