import { DataSource, type DataSourceOptions } from 'typeorm';
import { EventSource } from './entity/event-source.js';

// typeorm doesn't export individual connection options
export type PostgresConnectionOptions = Extract<
  DataSourceOptions,
  { type: 'postgres' }
>;

export class Db extends DataSource {
  constructor(
    options: Pick<
      PostgresConnectionOptions,
      'host' | 'port' | 'username' | 'password' | 'database'
    >,
  ) {
    super({
      ...options,
      type: 'postgres',
      entities: [EventSource],
    });
  }
}
