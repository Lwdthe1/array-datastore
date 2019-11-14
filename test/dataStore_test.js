"use stict";

const { assert } = require("chai");

const ArrayDataStore = require("../index");
const testHelper = require("./TestHelper").instance();

describe("#instance()", () => {
  it("Should succeed to create new instance of the store without placeholders", () => {
    const store = ArrayDataStore.instance();
    assert.deepEqual(store.getObjects(), []);
    assert.isFalse(store.hasPlaceholders());
  });

  it("Should succeed to create new instance of the store with placeholder objects", () => {
    const store = ArrayDataStore.instance({ placeholders: 5 });
    assert.deepEqual(store.getObjects(), [
      {
        $isPlaceholder: true,
        $index: 0
      },
      {
        $isPlaceholder: true,
        $index: 1
      },
      {
        $isPlaceholder: true,
        $index: 2
      },
      {
        $isPlaceholder: true,
        $index: 3
      },
      {
        $isPlaceholder: true,
        $index: 4
      }
    ]);

    assert.isTrue(store.hasPlaceholders());
  });
});

describe("#addUniqueObject()", function() {
  it("Should succeed to add new object to the store", () => {
    const store = ArrayDataStore.instance();
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };

    assert.equal(store.size, 0);

    store.addUniqueObject(obj1);

    assert.equal(store.size, 1);

    store.addUniqueObject(obj2);

    assert.equal(store.size, 2);
  });
});

describe("#addUniqueObjects()", function() {
  it(
    "Should succeed to add only unique objects to the store",
    testHelper.testWithStubs(() => {
      const store = ArrayDataStore.instance();

      const obj1 = { id: 123, name: "Lincoln" };
      const obj2 = { id: 234, name: "Daniel" };
      const obj3Duplicate = { id: 123, name: "Sam" };

      const addUniqueObjectSpy = testHelper.spy(store, "_addUniqueObject");

      assert.equal(store.size, 0);

      store.addUniqueObjects([obj1, obj2, obj3Duplicate]);

      assert.equal(store.size, 2);
      assert.deepEqual(store.getObjects(), [obj1, obj2]);

      assert.equal(addUniqueObjectSpy.callCount, 3);
    })
  );
});

describe("#prependUniqueObject()", function() {
  it(
    "Should call the prependUniqueObjects method with the object in an array",
    testHelper.testWithStubs(() => {
      const store = ArrayDataStore.instance();

      const obj1 = { id: 123, name: "Lincoln" };

      const prependUniqueObjectsSpy = testHelper.spy(
        store,
        "prependUniqueObjects"
      );

      store.prependUniqueObject(obj1);

      assert.isTrue(prependUniqueObjectsSpy.calledOnce);
      assert.deepEqual(prependUniqueObjectsSpy.lastCall.args, [[obj1]]);
    })
  );
});

describe("#prependUniqueObjects()", function() {
  it(
    "Should succeed to add only unique objects to the front of the store's array",
    testHelper.testWithStubs(() => {
      const store = ArrayDataStore.instance();

      const obj1 = { id: 123, name: "Lincoln" };
      const obj2 = { id: 234, name: "Daniel" };
      const obj3Duplicate = { id: 123, name: "Sam" };

      store.addUniqueObjects([obj1, obj2]);

      assert.equal(store.size, 2);
      assert.deepEqual(store.getObjects(), [obj1, obj2]);

      const addUniqueObjectSpy = testHelper.spy(store, "_addUniqueObject");

      const newObj = { id: 345, name: "Colin" };
      store.prependUniqueObjects([obj3Duplicate, newObj]);

      assert.deepEqual(store.getObjects(), [newObj, obj1, obj2]);

      assert.equal(addUniqueObjectSpy.callCount, 2);
      assert.isTrue(
        addUniqueObjectSpy.getCalls().every(call => {
          return call.args[1] === true;
        })
      );
    })
  );
});

describe("#getObjectById()", function() {
  it("Should succeed to get an object by its id when exists in the store", () => {
    const store = ArrayDataStore.instance();
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };

    store.addUniqueObjects([obj1, obj2]);

    assert.deepEqual(store.getObjectById(obj2.id), obj2);
  });

  it("Should fail to get an object by its id when does not exist in the store", () => {
    const store = ArrayDataStore.instance();
    store.addUniqueObjects([{ id: 123, name: "Lincoln" }]);

    assert.isUndefined(store.getObjectById(12));
  });
});

describe("#hasObjectById()", function() {
  it("Should return true for when object exists in the store by the provided id", () => {
    const store = ArrayDataStore.instance();
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };

    store.addUniqueObjects([obj1, obj2]);

    assert.isTrue(store.hasObjectById(obj2.id));
  });

  it("Should return false when object does not exist in the store by the provided id", () => {
    const store = ArrayDataStore.instance();
    store.addUniqueObjects([{ id: 123, name: "Lincoln" }]);

    assert.isFalse(store.hasObjectById(12));
  });
});

describe("#deleteObjectById()", function() {
  it("Should succeed to delete the object by its id and return the object and its index when exists in the store.", () => {
    const store = ArrayDataStore.instance();
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };

    store.addUniqueObjects([obj1, obj2, { id: 345 }]);

    assert.deepEqual(store.deleteObjectById(obj2.id), {
      object: obj2,
      index: 1
    });
  });

  it("Should fail to delete an object by its id when it does not exist in the store", () => {
    const store = ArrayDataStore.instance();
    store.addUniqueObjects([{ id: 123, name: "Lincoln" }]);

    assert.isUndefined(store.deleteObjectById(12));
  });
});

describe("#replaceObject()", function() {
  it(
    "Should succeed to replace the old object with the new object by deleting the old and adding the new at its index when exists in the store with same id.",
    testHelper.testWithStubs(() => {
      const store = ArrayDataStore.instance();
      const obj1 = { id: 123, name: "Lincoln" };
      const obj2 = { id: 234, name: "Daniel" };

      store.addUniqueObjects([obj1, obj2]);

      const deleteObjectByIdSpy = testHelper.spy(store, "deleteObjectById");
      const addUniqueObjectSpy = testHelper.spy(store, "_addUniqueObject");

      const newObj2 = { id: obj2.id, name: "Smith Jones" };
      store.replaceObject(newObj2);

      assert.isTrue(store.getObjectById(obj2.id) === newObj2);
      assert.isTrue(store.getObjectById(obj2.id) !== obj2);

      assert.isTrue(deleteObjectByIdSpy.calledOnce);
      assert.isTrue(addUniqueObjectSpy.calledOnce);
      assert.deepEqual(deleteObjectByIdSpy.lastCall.args, [obj2.id]);
      // Ensure called with the index of the existing object
      assert.deepEqual(addUniqueObjectSpy.lastCall.args, [newObj2, false, 1]);
    })
  );

  it(
    "Should succeed to add the object to the store when another does not already exist with the same id.",
    testHelper.testWithStubs(() => {
      const store = ArrayDataStore.instance();
      const obj1 = { id: 123, name: "Lincoln" };
      const obj2 = { id: 234, name: "Daniel" };

      store.addUniqueObjects([obj1, obj2]);

      const deleteObjectByIdSpy = testHelper.spy(store, "deleteObjectById");
      const addUniqueObjectSpy = testHelper.spy(store, "_addUniqueObject");

      const newObj = { id: 345, name: "John Doe" };

      store.replaceObject(newObj);

      assert.deepEqual(store.getObjectById(newObj.id), newObj);

      assert.isTrue(deleteObjectByIdSpy.calledOnce);
      assert.isTrue(addUniqueObjectSpy.calledOnce);
      assert.deepEqual(deleteObjectByIdSpy.lastCall.args, [newObj.id]);
      // No existing object index, so not provided.
      assert.deepEqual(addUniqueObjectSpy.lastCall.args, [newObj, false]);
    })
  );
});

describe("#clearPlaceholders()", () => {
  it.only("Should succeed to clear the placeholder objects from the store", () => {
    const store = ArrayDataStore.instance({ placeholders: 5 });
    assert.deepEqual(store.getObjects(), [
      {
        $isPlaceholder: true,
        $index: 0
      },
      {
        $isPlaceholder: true,
        $index: 1
      },
      {
        $isPlaceholder: true,
        $index: 2
      },
      {
        $isPlaceholder: true,
        $index: 3
      },
      {
        $isPlaceholder: true,
        $index: 4
      }
    ]);

    assert.isTrue(store.hasPlaceholders());

    store.clearPlaceholders();
    assert.isFalse(store.hasPlaceholders());
  });
});
