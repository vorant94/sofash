import { DataSource, type DataSourceOptions } from 'typeorm';
import { DB_NAME, DB_TYPE } from './core/tokens.js';
import { EventSourceDataSource } from './event-source/event-source.data-source.js';
import { EventSourceEntity } from './event-source/event-source.entity.js';
import { EventDataSource } from './event/event.data-source.js';
import { EventEntity } from './event/event.entity.js';

export class Db {
  readonly eventSources: EventSourceDataSource;
  readonly events: EventDataSource;

  readonly #db: DataSource;

  constructor(options: DbOptions) {
    this.#db = new DataSource({
      ...options,
      database: DB_NAME,
      type: DB_TYPE,
      entities: [EventSourceEntity, EventEntity],
    });

    this.eventSources = new EventSourceDataSource(
      this.#db.getRepository(EventSourceEntity),
    );
    this.events = new EventDataSource(this.#db.getRepository(EventEntity));
  }

  async initialize(): Promise<void> {
    await this.#db.initialize();
  }

  async destroy(): Promise<void> {
    await this.#db.destroy();
  }
}

export type DbOptions = Pick<
  Extract<DataSourceOptions, { type: 'postgres' }>,
  'host' | 'port' | 'username' | 'password'
>;
