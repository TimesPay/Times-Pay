import isEqual from 'lodash.isequal';
export const deepCompare = (a, b) => {
  return isEqual(a, b);
}
