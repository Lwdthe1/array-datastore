A datastore to easily and consistently store unique objects in an array.

You can also specify placeholders for displaying shimmers while awaiting data from an API call.

<div class="badge-examples__ExampleTable-sc-1m4e1ck-0 hgKsAa"><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub issues badge" src="https://img.shields.io/github/issues/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub forks badge" src="https://img.shields.io/github/forks/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub stars badge" src="https://img.shields.io/github/stars/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub license badge" src="https://img.shields.io/github/license/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="Twitter badge" src="https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2FLwdthe1%2Fjsdoc-rest-api"></span></tbody></table>

- [Install](#install)
- [Usage](#usage)
- [Example](#example)
- [Tests](#tests)
- [Contributing](#contributing)

# Install

`npm install --save array-datastore`

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

See the tests (`tests/dataStore_test.js`) to see how these methods are used.

## config object

When creating the store, you can specify an optional configuration object.

### placeholders: `number|Array<Object>`

You can specify a number of placeholders or an array of placeholder objects that will populate the store until you add your first actual object or you call the #clearPlaceholders() method.

## Example

![carbon (4)](https://user-images.githubusercontent.com/5778798/68904124-fd9c8600-06f1-11ea-9d33-33a9f8613121.png)

## Tests

We use mocha and chai. Run `npm test`

## Contributing

Feel free to open a pull request!
