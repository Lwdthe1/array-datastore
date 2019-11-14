This library can generate a map of your REST API endpoints from your JsDoc and use that map to automatically hook up your endpoints to your ExpressJs app when starting your REST API web server.

<div class="badge-examples__ExampleTable-sc-1m4e1ck-0 hgKsAa"><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub issues badge" src="https://img.shields.io/github/issues/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub forks badge" src="https://img.shields.io/github/forks/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub stars badge" src="https://img.shields.io/github/stars/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub license badge" src="https://img.shields.io/github/license/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="Twitter badge" src="https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2FLwdthe1%2Fjsdoc-rest-api"></span></tbody></table>

- [Install](#install)
- [Usage](#usage)
- [Tests](#tests)
- [Contributing](#contributing)

## Install

`npm install --save array-datastore`

## Usage

1. `constructor.instance(configObject)` Create a new instance of the store with an optional configuration object.
2. `addUniqueObject()` Add an unique object to the store.
3. `addUniqueObjects()` Add an array unique objects to the store.
4. `prependUniqueObject()` Add an unique object to front of the store.
5. `prependUniqueObjects()` Add an array unique objects to front of the store.
6. `replaceObject()` Replace an existing object or add to the store.
7. `getObjectById()` Get an object from the store by its id.
8. `deleteObjectById()` Delete an object from the store by its id.
9. `hasObjectById()` Check if the store has an object by its id.

See the tests (`tests/dataStore_test.js`) to see how these methods are used.

## Tests

We use mocha and chai. Run `npm test` to test the generators.

## Contributing

Feel free to open a pull request.
