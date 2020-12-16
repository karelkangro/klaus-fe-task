export const splitStringByUnderscore = str => str.match(/([^_]+)/g);
export const concatenateString = str => str.join(" ").toLowerCase();
export const stringToUppercase = str =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const parsedString = str =>
  stringToUppercase(concatenateString(splitStringByUnderscore(str)));

export const sortArrayByObjectKeys = (array, role) =>
  array.sort((a, b) => a[role].localeCompare(b[role]));
