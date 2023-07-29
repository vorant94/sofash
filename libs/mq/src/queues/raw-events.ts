import { Queue } from 'bullmq';
import { type Redis } from 'ioredis';
import { type RawEvent } from '../models/raw-event.js';

export class RawEvents {
  private readonly queue: Queue;

  constructor(connection: Redis) {
    this.queue = new Queue('raw-events', {
      connection,
    });
  }

  async addBulk(rawEvents: RawEvent[]): Promise<void> {
    await this.queue.addBulk(
      rawEvents.map((rawEvent) => ({
        name: rawEvent.name,
        data: rawEvent,
      })),
    );
  }
}
