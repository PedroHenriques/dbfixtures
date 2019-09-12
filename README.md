[![Build Status](https://travis-ci.org/PedroHenriques/dbfixtures.svg?branch=master)](https://travis-ci.org/PedroHenriques/dbfixtures)

# Fixtures Manager

An abstraction layer for handling database fixtures for automated testing purposes, providing a standardized interface across different database systems.

## Installation

```sh
npm install --save-dev dbfixtures
```

## Features

* Test runner agnostic
* No dependencies
* Written in TypeScript
* Standardized interface across multiple database systems
* Easily set your database for each test's needs

## NodeJS versions

- **Package version `>=2.*`** supports NodeJS `v8` or higher.  

- **Package version `>=1.1.*`** supports NodeJS `v8` or higher.  
  **NOTE:** For versions `8` and `9` the node flag `--harmony_promise_finally` is required

- **Package version `1.0.*`** supports NodeJS `v7` or higher.  

## Drivers

This package will use drivers to handle the database operations.
Each driver will be dedicated to 1 databse system (ex: MySQL, MongoDb).  
You can set as many drivers as needed and the fixtures will be sent to each one.

### Driver interface

The drivers are expected to use the following interface

```js
// clears the specified "tables" from any content
truncate: (tableNames: string[]) => Promise<void>

// inserts the supplied "rows" into the specified "table"
insertFixtures: (tableName: string, fixtures: {}[]) => Promise<void>

// terminates the connection to the database
close: () => Promise<void>
```

### Current official drivers

* [MySQL](https://github.com/PedroHenriques/dbfixtures-mysql-driver)

* [MongoDB](https://github.com/PedroHenriques/dbfixtures-mongodb-driver)

## Usage

This package exposes 3 functions

* `setDrivers(...newDrivers: IDriver[]): void`: call this function with the array of driver instances to be used when fixtures are inserted.

* `insertFixtures(fixtures: IFixtures): Promise<void>`: call this function with the fixtures to be sent to each registered driver.  
**Note:** the fixtures will be inserted in the order they are provided.

* `closeDrivers(): Promise<void>`: call this function to run any necessary cleanup operations on all registered drivers (ex: close DB connections).

The `IDriver` interface is described in the section **Driver interface** above.

The `IFixtures` interface is an object with strings as keys and arrays as values.  
The keys are "table" names and for each one provide an array of objects, each representing a "row" to be inserted.

### Example

This example uses [Mocha](https://mochajs.org/) as the potential test runner.

```js
const dbfixtures = require('dbfixtures');
const fixturesMysqlDriver = require('dbfixtures-mysql-driver');

const mysqlConnectionInfo = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '',
  database: 'fixtures_test',
};
const fixtures = {
  'roles': [
    { id: 1, name: 'role 1' },
    { id: 2, name: 'role 2' },
  ],
  'users': [
    { id: 1, email: 'myemail@test.net', role_id: 2 },
    { id: 2, email: 'test@gmail.com', role_id: 1 },
    { id: 3, email: 'another@email.org', role_id: 1 },
  ],
};

describe('fixtures example', function () {
  before(async function () {
    const mysqlDriver = await fixturesMysqlDriver.create(mysqlConnectionInfo);
    dbfixtures.setDrivers(mysqlDriver);
  });

  after(async function () {
    await dbfixtures.closeDrivers();
  });

  beforeEach(async function () {
    await dbfixtures.insertFixtures(fixtures);
  });

  it('should have the database seeded with the fixtures', function () {
    // ...
  });
});
```

## How It Works

Each registered driver will be called to:

* clear the "tables" that will be used in the current fixture insertion operation from any content.

* insert the fixtures in the order they were provided.

* terminate the connection to their database.

## Testing This Package

* `cd` into the package's directory
* run `npm install`
* run `npm run build`

* for unit tests run `npm test -- test/unit/`
