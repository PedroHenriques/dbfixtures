'use strict';

export interface IDriver {
  truncate: (tableNames: string[]) => Promise<void>,
  insertFixtures: (tableName: string, fixtures: [{}]) => Promise<void>,
  close: () => Promise<void>,
}

export interface IFixtures {
  [key: string]: [{}]
}