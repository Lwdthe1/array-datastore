A datastore to easily and consistently store unique objects in an array.

You can also specify placeholders for displaying shimmers while awaiting data from an API call.

- [Install](#install)
- [Usage](#usage)
- [Example](#example)
- [Tests](#tests)
- [Contributing](#contributing)

# Install

`npm install --save array-datastore`

![Array-DataStore](https://user-images.githubusercontent.com/5778798/69487585-79dd4a80-0e11-11ea-820d-6f8aff89e0e9.png)

# Usage

- `constructor.instance(configObject)` Create a new instance of the store with an optional configuration object.
- `addUniqueObject()` Add an unique object to the store. Objects are unique by their `id` field, so ensure your objects have that.
- `addUniqueObjects()` Add an array unique objects to the store.
- `prependUniqueObject()` Add an unique object to front of the store.
- `prependUniqueObjects()` Add an array unique objects to front of the store.
- `setBeforeAddProcessor(callbackFunction)` Set a function that will be called before any time an object is added to the store.

- `hasObjectById()` Check if the store has an object by its id.
- `replaceObject()` Replace an existing object or add to the store.
- `deleteObjectById()` Delete an object from the store by its id.
- `reset()` Delete all objects from the store.

- `getObjects()` Get all the objects in the store.
- `getObjectIds()` Get all the object ids in the store.
- `getObjectById()` Get an object from the store by its id.
- `getObjectAtIndex()` Get an object from the store at a specific index.
- `getObjectByPredicate()`Get the first object matching the provided filter predicate.
- `getObjectIndexById()` Get the index of an object by its id.

- `hasPlaceholders()` Checks if the store has placeholder objects.
- `clearPlaceholders()` Remove the placeholder objects from the store.
- `sections` Get the sections of the datastore. As you add values to the datastore, they are also added to a `sectionedList`. Note that this sectionedList can only be added to and no items will ever be removed from it; this may change in the future. See [sectioned-list](https://github.com/Lwdthe1/sectioned-list) library for details.

See the tests (`tests/dataStore_test.js`) to see how these methods are used.

## config object

When creating the store, you can specify an optional configuration object.

### placeholders: `number|Array<Object>`

You can specify a number of placeholders or an array of placeholder objects that will populate the store until you add your first actual object or you call the #clearPlaceholders() method.

### sectionSizes: Array<Number>

See [sectioned-list](https://github.com/Lwdthe1/sectioned-list) library.

## Example

![carbon (4)](https://user-images.githubusercontent.com/5778798/68904124-fd9c8600-06f1-11ea-9d33-33a9f8613121.png)

## Tests

We use mocha and chai. Run `npm test`

## Contributing

Feel free to open a pull request!
