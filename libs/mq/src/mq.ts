import { Redis, type RedisOptions } from 'ioredis';
import { RawEventQueue } from './raw-event/raw-event.queue.js';

export class Mq {
  readonly rawEvents: RawEventQueue;

  readonly #connection: Redis;

  constructor(options: MqOptions) {
    this.#connection = new Redis({
      ...options,
      // TODO: lazy connect seems not to be working, since just creating the client leaving the process to hang
      //  unless quit is called, need to fix it
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });

    this.rawEvents = new RawEventQueue(this.#connection);
  }

  async destroy(): Promise<void> {
    await Promise.all([this.rawEvents.closeWorkers()]);
  }
}

export type MqOptions = Pick<RedisOptions, 'host' | 'port'>;
