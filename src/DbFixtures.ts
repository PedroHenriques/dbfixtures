'use strict';
import { IDriver, IFixtures } from './interfaces';

let drivers: IDriver[] = [];

/**
 * Registers drivers to be used when setFixtures() is called.
 */
export function setDrivers(...newDrivers: IDriver[]): void {
  drivers = newDrivers;
}

/**
 * Runs the provided fixtures through each registered driver.
 */
export async function insertFixtures(fixtures: IFixtures): Promise<void> {
  try {
    const tableNames = Object.keys(fixtures);
    for (let driverIndex = 0; driverIndex < drivers.length; driverIndex++) {
      const driver = drivers[driverIndex];
      try {
        await driver.truncate(tableNames.slice().reverse());
        for (let tableIndex = 0; tableIndex < tableNames.length; tableIndex++) {
          const tableName = tableNames[tableIndex];
          if (fixtures[tableName].length === 0) { continue; }
          await driver.insertFixtures(tableName, fixtures[tableName]);
        }
      } finally {
        await driver.close();
      }
    }
  } catch (error) {
    return(Promise.reject(error));
  }
}