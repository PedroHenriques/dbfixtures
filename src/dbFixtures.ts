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
  const tableNames = Object.getOwnPropertyNames(fixtures);
  const driverPromises: Promise<void>[] = [];

  drivers.forEach((driver): void => {
    driverPromises.push(
      driver.truncate(tableNames)
      .then(async (): Promise<void> => {
        for (let i = 0; i < tableNames.length; i++) {
          await driver.insertFixtures(tableNames[i], fixtures[tableNames[i]]);
        }
      })
      .finally((): Promise<void> => {
        return driver.close();
      })
    );
  });

  await Promise.all(driverPromises);
}