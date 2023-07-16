import { DataSource, type DataSourceOptions } from 'typeorm';
import { EventSource } from './entities/event-source.js';
import { DB_NAME } from './tokens.js';
import { EventSources } from './data-sources/event-sources.js';

export class Db {
  public readonly eventSources: EventSources;

  private readonly db: DataSource;

  constructor(options: DbOptions) {
    this.db = new DataSource({
      ...options,
      database: DB_NAME,
      type: 'postgres',
      entities: [EventSource],
    });

    this.eventSources = new EventSources(this.db.getRepository(EventSource));
  }

  async initialize(): Promise<void> {
    await this.db.initialize();
  }

  async destroy(): Promise<void> {
    await this.db.destroy();
  }
}

export type DbOptions = Pick<
  Extract<DataSourceOptions, { type: 'postgres' }>,
  'host' | 'port' | 'username' | 'password'
>;
