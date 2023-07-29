import { Redis, type RedisOptions } from 'ioredis';
import { RawEvents } from './queues/raw-events.js';

export class Mq {
  readonly rawEvents: RawEvents;

  readonly #connection: Redis;

  constructor(options: MqOptions) {
    this.#connection = new Redis({
      ...options,
      lazyConnect: true,
    });

    this.rawEvents = new RawEvents(this.#connection);
  }

  async quit(): Promise<void> {
    await this.#connection.quit();
  }
}

export type MqOptions = Pick<RedisOptions, 'host' | 'port'>;
