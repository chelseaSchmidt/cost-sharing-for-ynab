export const getFiveDaysAgo = () => {
  const day = new Date();
  return new Date(day.setDate(day.getDate() - 5));
};

export const convertDateToString = (date) => {
  const month = date.getMonth().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};
