# Changelog

## [2.0.1] - 2020-09-29
### Added
- Link to the DynamoDb driver in the README file
- New versions of NPM dev dependencies

## [2.0.0] - 2019-09-12
### Added
- The `closeDrivers` exported function, which will call each registered driver's `close` function

### Changed
- insertFixtures() no longer calls each registered driver's close(), removing the need to register the drivers before each test
- Updated NPM devDependencies to latest versions

### Removed
- Deprecated linter option

## [1.1.1] - 2019-01-10
### Added
- Information about supported NodeJS versions to the `README.md` file

### Fixed
- Incorrect minimal supported NodeJS version, which is `8` and not `10`, provided the `--harmony_promise_finally` flag is used when running node

## [1.1.0] - 2019-01-03
### Changed
- Refactored the `insertFixtures()` function to improve performance when handling multiple drivers at the same time
- Improved unit tests, to have more coverage and have only 1 assert per test function
- Cleaned up the NPM scripts
- Updated all NPM devDependencies to latests versions
- Improved the `README.md` file with mentions to the now available `MongoDB` driver and other overall text improvements
- Updated `travis ci` configuration file to include only versions of NodeJS >= 10, due to the use of Promise's `finally()` method

### Removed
- NPM not needed devDependencies: `@types/node` and `ts-node`

## [1.0.1] - 2018-02-09
### Fixed
- Type definitions for IFixtures and IDriver, replacing `[{}]` with `{}[]`
- Added missing package-lock.json file

## [1.0.0] - 2018-01-20
### Added
- First version of the code