# Changelog

## [1.1.0] - 2019-01-03
### Changed
- Refactored the `insertFixtures()` function to improve performance when handling multiple drivers at the same time
- Improved unit tests, to have more coverage and have only 1 assert per test function
- Cleaned up the NPM scripts
- Updated all NPM devDependencies to latests versions
- Improved the `README.md` file with mentions to the now available `MongoDB` driver and other overall text improvements
- Updated `travis ci` configuration file to include latests versions of NodeJS

### Removed
- NPM not needed devDependencies: `@types/node` and `ts-node`

## [1.0.1] - 2018-02-09
### Fixed
- Type definitions for IFixtures and IDriver, replacing `[{}]` with `{}[]`
- Added missing package-lock.json file

## [1.0.0] - 2018-01-20
### Added
- First version of the code