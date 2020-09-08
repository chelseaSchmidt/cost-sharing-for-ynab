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

export const convertStringToDate = (string, startOfDay = true) => {
  // yyyy-mm-dd
  const month = Number(string.slice(5, 7));
  const day = Number(string.slice(8));
  const year = Number(string.slice(0, 4));
  const date = new Date();
  date.setMonth(month - 1);
  date.setDate(day);
  date.setFullYear(year);
  if (startOfDay) {
    date.setHours(0, 0, 0, 0);
  } else {
    date.setHours(23, 59, 59, 999);
  }
  return date;
};
