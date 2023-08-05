import { Redis, type RedisOptions } from 'ioredis';
import { RawEventQueue } from './raw-event/raw-event.queue.js';
import { EventEmitter } from 'events';
import { MqEvent } from './shared/mq-event.js';

export class Mq {
  readonly rawEvents: RawEventQueue;

  readonly #connection: Redis;
  readonly #mqEmitter = new EventEmitter();

  constructor(options: MqOptions) {
    this.#connection = new Redis({
      ...options,
      // TODO: lazy connect seems not to be working, since just creating the client leaving the process to hang
      //  unless quit is called, need to fix it
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });

    this.rawEvents = new RawEventQueue(this.#connection, this.#mqEmitter);
  }

  async quit(): Promise<void> {
    await this.#connection.quit();
  }

  runWorkers(): void {
    this.#mqEmitter.emit(MqEvent.RUN_WORKERS);
  }
}

export type MqOptions = Pick<RedisOptions, 'host' | 'port'>;
