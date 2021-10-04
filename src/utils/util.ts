/**
 * @method isEmpty
 * @param {String} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value === '') {
    return true;
  } else {
    return false;
  }
};
