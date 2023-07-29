import { Redis, type RedisOptions } from 'ioredis';
import { RawEvents } from './queues/raw-events.js';

export class Mq {
  public readonly rawEvents: RawEvents;

  private readonly connection: Redis;

  constructor(options: MqOptions) {
    // TODO find a way to make a connection lazy, because just setting lazyConnect
    //  flag to true for some reason causes "Redis is already connecting/connected"
    //  error when used in cli with "usingMq" pattern
    this.connection = new Redis({
      ...options,
    });

    this.rawEvents = new RawEvents(this.connection);
  }

  async quit(): Promise<void> {
    await this.connection.quit();
  }
}

export type MqOptions = Pick<RedisOptions, 'host' | 'port'>;
