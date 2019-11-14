"use strict";

//a function for checking if an value is a function
const isArray = function(objToCheck) {
  return (
    (objToCheck &&
      Object.prototype.toString.call(objToCheck) === "[object Array]") ||
    false
  );
};

function removeElementAtIndex(array, index) {
  if (index > -1 && !isEmpty(array)) {
    var element = array[index];
    array.splice(index, 1);
    return element;
  }
  return null;
}

const isEmpty = function(arr) {
  if (!isArray(arr)) return true;
  return arr.length < 1;
};

module.exports = {
  isType: isArray,
  removeElementAtIndex
};
