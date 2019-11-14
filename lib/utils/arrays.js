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
  if (index > -1 && !isEmptyArray(array)) {
    var element = array[index];
    array.splice(index, 1);
    return element;
  }
  return null;
}

module.exports = {
  isType: isArray,
  removeElementAtIndex
};
