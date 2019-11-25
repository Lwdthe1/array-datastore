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

  it(
    "Should call the setBeforeAddProcessor when set",
    testHelper.testWithStubs(() => {
      const store = ArrayDataStore.instance();
      store.setBeforeAddProcessor((object, opts) => {
        if (opts.isPrepend) {
          console.log("Prepending object:", object.id);
        } else {
          console.log("Adding object:", object.id);
        }
      });

      const beforeAddObjectProcessorSpy = testHelper.spy(
        store,
        "_beforeAddObjectProcessor"
      );

      const obj1 = { id: 123, name: "Lincoln" };
      const obj2 = { id: 234, name: "Daniel" };

      store.addUniqueObjects([obj1, obj2]);

      assert.equal(beforeAddObjectProcessorSpy.callCount, 2);
      const calls = beforeAddObjectProcessorSpy.getCalls();
      assert.deepEqual(calls[0].args, [obj1, { isPrepend: false }]);
      assert.deepEqual(calls[1].args, [obj2, { isPrepend: false }]);
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

  it(
    "Should call the setBeforeAddProcessor when set",
    testHelper.testWithStubs(() => {
      const store = ArrayDataStore.instance();
      store.setBeforeAddProcessor((object, opts) => {
        if (opts.isPrepend) {
          console.log("Prepending object:", object.id);
        } else {
          console.log("Adding object:", object.id);
        }
      });

      const beforeAddObjectProcessorSpy = testHelper.spy(
        store,
        "_beforeAddObjectProcessor"
      );

      const obj1 = { id: 123, name: "Lincoln" };
      const obj2 = { id: 234, name: "Daniel" };

      store.prependUniqueObjects([obj1, obj2]);

      assert.equal(beforeAddObjectProcessorSpy.callCount, 2);
      const calls = beforeAddObjectProcessorSpy.getCalls();
      assert.deepEqual(calls[0].args, [obj1, { isPrepend: true }]);
      assert.deepEqual(calls[1].args, [obj2, { isPrepend: true }]);
    })
  );
});

describe("#setBeforeAddProcessor()", function() {
  it("Should set the _beforeAddObjectProcessor field with the provided function", () => {
    const store = ArrayDataStore.instance();

    assert.isUndefined(store._beforeAddObjectProcessor);

    const processor = (object, _opts) => {
      object.foo = "bar";
    };

    // Set the processor
    store.setBeforeAddProcessor(processor);
    assert.equal(store._beforeAddObjectProcessor, processor);

    const processor2 = (object, opts) => {
      if (opts.isPrepend) {
        console.log("Prepending object:", object.id);
      } else {
        console.log("Adding object:", object.id);
      }
    };

    // Update the processor
    store.setBeforeAddProcessor(processor2);
    assert.equal(store._beforeAddObjectProcessor, processor2);
  });
});

describe("#getObjects()", function() {
  it("Should return all the objects in the store.", () => {
    const store = ArrayDataStore.instance();
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };
    const obj3 = { id: 345 };

    store.addUniqueObjects([obj1, obj2, obj3, obj1]);
    assert.deepEqual(store.getObjects(), [obj1, obj2, obj3]);
  });
});

describe("#getObjectIds()", function() {
  it("Should return all the object ids in the store.", () => {
    const store = ArrayDataStore.instance();
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };
    const obj3 = { id: 345 };

    store.addUniqueObjects([obj1, obj2, obj3, obj1]);
    assert.deepEqual(store.getObjectIds(), [
      `${obj1.id}`,
      `${obj2.id}`,
      `${obj3.id}`
    ]);
  });
});

describe("#sections()", function() {
  it("Should return all sections in the store when custom section sizes not provided.", () => {
    const store = ArrayDataStore.instance({});
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };
    const obj3 = { id: 345 };
    const obj4 = { id: 456 };
    const obj5 = { id: 567 };
    const obj6 = { id: 678 };
    const obj7 = { id: 789 };
    const obj8 = { id: 891 };
    const obj9 = { id: 911 };
    const obj10 = { id: 1011 };
    const obj11 = { id: 1112 };
    const obj12 = { id: 1213 };

    store.addUniqueObjects([
      obj1,
      obj2,
      obj3,
      obj1,
      obj4,
      obj5,
      obj6,
      obj7,
      obj8,
      obj9,
      obj10,
      obj11,
      obj12
    ]);

    assert.deepEqual(
      store.sections.map(({ items }) => items),
      [
        [obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9, obj10],
        [obj11, obj12]
      ]
    );
  });

  it("Should return all sections in the store when custom section sizes provided.", () => {
    const store = ArrayDataStore.instance({ sectionSizes: [1, 2, 0, 3] });
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };
    const obj3 = { id: 345 };
    const obj4 = { id: 456 };
    const obj5 = { id: 567 };
    const obj6 = { id: 678 };
    const obj7 = { id: 789 };
    const obj8 = { id: 891 };

    store.addUniqueObjects([
      obj1,
      obj2,
      obj3,
      obj1,
      obj4,
      obj5,
      obj6,
      obj7,
      obj8
    ]);

    assert.deepEqual(
      store.sections.map(({ items }) => items),
      [[obj1], [obj2, obj3], [], [obj4, obj5, obj6], [obj7, obj8]]
    );
  });
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

describe("#getObjectAtIndex()", function() {
  it("Should succeed to get an object at the provided index in the store", () => {
    const store = ArrayDataStore.instance();
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };

    store.addUniqueObjects([obj1, obj2]);

    assert.deepEqual(store.getObjectAtIndex(1), obj2);
    assert.deepEqual(store.getObjectAtIndex(1), obj2);
  });

  it("Should return undefined for invalid index ", () => {
    const store = ArrayDataStore.instance();
    store.addUniqueObjects([{ id: 123, name: "Lincoln" }]);

    assert.isUndefined(store.getObjectAtIndex(6));
  });

  it("Should return undefined when store is empty ", () => {
    const store = ArrayDataStore.instance();

    assert.isUndefined(store.getObjectAtIndex(0));
  });
});

describe("#getObjectByPredicate()", function() {
  it("Should succeed to get the first object matching the provided filter when exists in the store", () => {
    const store = ArrayDataStore.instance();
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };
    const obj3 = { id: 345, name: "Daniel" };

    store.addUniqueObjects([obj1, obj2, obj3]);

    assert.deepEqual(
      store.getObjectByPredicate(object => {
        return object.name == "Daniel";
      }),
      obj2
    );
  });

  it("Should fail to get an object by the provided predicate when does not exist in the store.", () => {
    const store = ArrayDataStore.instance();
    store.addUniqueObjects([{ id: 123, name: "Lincoln" }]);

    assert.isUndefined(
      store.getObjectByPredicate(object => {
        return object.name == "Daniel";
      })
    );
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

describe("#getObjectIndexById()", function() {
  it("Should return the index of the object when it exists in the store by the provided id", () => {
    const store = ArrayDataStore.instance();
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };

    store.addUniqueObjects([obj1, obj2]);

    assert.equal(store.getObjectIndexById(obj2.id), 1);
  });

  it("Should return -1 when object does not exist in the store by the provided id", () => {
    const store = ArrayDataStore.instance();
    store.addUniqueObjects([{ id: 123, name: "Lincoln" }]);

    assert.equal(store.getObjectIndexById(12), -1);
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
  it("Should succeed to clear the placeholder objects from the store", () => {
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

describe("#reset()", function() {
  it("Should succeed to delete the object by its id and return the object and its index when exists in the store.", () => {
    const store = ArrayDataStore.instance();
    const obj1 = { id: 123, name: "Lincoln" };
    const obj2 = { id: 234, name: "Daniel" };
    const obj3 = { id: 345 };

    store.addUniqueObjects([obj1, obj2, obj3]);
    assert.deepEqual(store.getObjects(), [obj1, obj2, obj3]);
    assert.deepEqual(store.getObjectIds(), [
      `${obj1.id}`,
      `${obj2.id}`,
      `${obj3.id}`
    ]);

    store.reset();
    assert.deepEqual(store.getObjects(), []);
    assert.deepEqual(store.getObjectIds(), []);
  });
});
