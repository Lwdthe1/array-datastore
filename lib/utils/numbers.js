"use strict";

function isType(obj) {
  return Object.prototype.toString.call(obj) == "[object Number]";
}

module.exports = {
  isType
};
