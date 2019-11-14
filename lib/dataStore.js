"use strict";

const lodash = require("lodash");
const arrays = require("./utils/arrays");
const numbers = require("./utils/numbers");

class ArrayDataStore {
  constructor(config = {}) {
    this._id = Date.now();
    this._objectIdMap = {};
    this._objects = [];

    let placeholdersData;
    let numPlaceholders;
    if (!config.placeholders) {
      config.placeholders = [];
    }

    if (arrays.isType(config.placeholders)) {
      placeholdersData = config.placeholders;
      numPlaceholders = placeholdersData.length;
    } else if (numbers.isType(config.placeholders)) {
      numPlaceholders = config.placeholders;
      placeholdersData = [];
    }

    this._numPlaceholders = numPlaceholders || 0;
    this._placeholdersData = placeholdersData || [];
    this._placeholdersCleared = false;

    if (this._numPlaceholders) {
      this._preparePlaceholders();
    }
  }

  get id() {
    return this._id;
  }

  get size() {
    return (
      this._objects.length -
      (this.hasPlaceholders() ? this._numPlaceholders : 0)
    );
  }

  hasContents() {
    return this.size > 0;
  }

  hasPlaceholders() {
    return this._numPlaceholders && !this._placeholdersCleared;
  }

  get contents() {
    return this._objects;
  }

  reset() {
    this._objects = [];
    this._objectIdMap = {};
  }

  /**
   * Adds the desired number of placeholders to the objects array.
   */
  _preparePlaceholders() {
    for (let i = 0; i < this._numPlaceholders; i++) {
      const requiredData = {
        $isPlaceholder: true,
        $index: this._objects.length
      };

      let placeholder;
      if (
        this._placeholdersData &&
        this._placeholdersData.length &&
        this._placeholdersData[i]
      ) {
        placeholder = lodash.merge(this._placeholdersData[i], requiredData);
      } else {
        placeholder = requiredData;
      }

      this._objects.push(placeholder);
    }
  }

  beforeAdd(processor) {
    this._beforeAddObjectProcessor = processor;
  }

  setObjectUidGetter(cb) {
    this._objectUidGetter = cb;
  }

  addUniqueObject(object) {
    return this.addUniqueObjects([object]);
  }

  addUniqueObjects(objects) {
    return this._addUniqueObjects(objects, false);
  }

  prependUniqueObject(object) {
    return this.prependUniqueObjects([object]);
  }

  prependUniqueObjects(objects) {
    return this._addUniqueObjects(objects, true);
  }

  _addUniqueObjects(objects, shouldPrepend) {
    if (!arrays.isType(objects)) {
      return this._objects;
    }

    objects.forEach(object => {
      this._addUniqueObject(object, shouldPrepend);
    });
    return this._objects;
  }

  getObjectById(id) {
    return this._objectIdMap[id];
  }

  hasObjectById(id) {
    return !!this._objectIdMap[id] && this._objectIdMap[id].id == id;
  }

  getIndexOfObjectById(objId) {
    return this._objects.findIndex(({ id }) => id == objId);
  }

  replaceObject(object) {
    const uid = this._getObjectUid(object);

    const deletedRecord = this.deleteObjectById(uid);

    if (!deletedRecord) {
      this._addUniqueObject(object, false);
    } else {
      this._addUniqueObject(object, false, deletedRecord.index);
    }
  }

  deleteObjectById(objectId) {
    let obj;
    let objectIndex = -1;
    this._objects.some((object, index) => {
      const uid = this._getObjectUid(object);
      if (uid == objectId) {
        arrays.removeElementAtIndex(this._objects, index);

        obj = this._objectIdMap[uid];
        delete this._objectIdMap[uid];

        objectIndex = index;
        return true;
      }
    });

    return objectIndex !== -1 ? { object: obj, index: objectIndex } : undefined;
  }

  /**
   * @param {(object) => boolean} predicate
   * @returns the first object that matches the predicate
   */
  getObjectByPredicate(predicate) {
    let foundObject;
    this.getObjects().some(object => {
      if (predicate(object)) {
        foundObject = object;
        return true;
      }
    });
    return foundObject;
  }

  /**
   * Clears the placehlders from the objects array.
   */
  clearPlaceholders() {
    if (!this._numPlaceholders) return;
    if (this._placeholdersCleared) return;

    for (let i = this._objects.length; i > -1; i--) {
      const object = this._objects[i];
      if (object && object.$isPlaceholder) {
        arrays.removeElementAtIndex(this._objects, i);
      }
    }

    this._placeholdersCleared = true;
  }

  _addUniqueObject(object, shouldPrepend, opt_atIndex) {
    if (!object) return;

    // Clear placeholders since an object is being added
    this.clearPlaceholders();

    const uid = this._getObjectUid(object);

    if (this._objectIdMap[uid]) {
      // Don't add duplicate object
      return;
    }

    try {
      if (this._beforeAddObjectProcessor) {
        this._beforeAddObjectProcessor(object);
      }
    } catch (err) {
      console.warn(
        `ArrayDataStore #${this.id} failed to run the before-add processor for that object ${object.id} due to ${err.stack}`
      );
    }

    this._objectIdMap[uid] = object;

    if (shouldPrepend) {
      // Add the object to the start of the array
      this._objects.unshift(object);
    } else if (opt_atIndex != null) {
      // Add the object at the desired index
      this._objects.splice(opt_atIndex, 0, object);
    } else {
      // Add the object to the end of the array
      this._objects.push(object);
    }
  }

  _getObjectUid(object) {
    let uid;
    if (this._objectUidGetter) {
      try {
        uid = this._objectUidGetter(object);
      } catch (err) {
        console.warn(
          `ArrayDataStore #${this.id} failed to get the object uid using the provided getter.`
        );
      }
    }

    // Return the uid or the object's id
    return uid != undefined ? uid : object.id;
  }

  getObjects() {
    return this._objects;
  }

  getCount() {
    return this.size;
  }

  static instance(config) {
    return new ArrayDataStore(config);
  }
}

module.exports = ArrayDataStore;
