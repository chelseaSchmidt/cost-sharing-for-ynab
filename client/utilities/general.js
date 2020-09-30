export const deCaseDeSpace = (string) => {
  const spaces = /\s/g;
  return string.toLowerCase().replace(spaces, '');
};
