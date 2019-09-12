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

  await Promise.all(
    drivers.map(driver =>
      driver.truncate(tableNames)
      .then(async (): Promise<void> => {
        for (let i = 0; i < tableNames.length; i++) {
          await driver.insertFixtures(tableNames[i], fixtures[tableNames[i]]);
        }
      })
    )
  );
}

/**
 * Runs closing cleanup steps for each registered driver.
 */
export async function closeDrivers(): Promise<void> {
  await Promise.all(
    drivers.map(driver => driver.close())
  );
}