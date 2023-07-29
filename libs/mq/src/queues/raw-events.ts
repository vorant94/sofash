import { Queue } from 'bullmq';
import { type Redis } from 'ioredis';
import { type RawEvent } from '../jobs/raw-event.js';

export class RawEvents {
  private readonly queue: Queue;

  constructor(connection: Redis) {
    this.queue = new Queue('raw-events', {
      connection,
    });
  }

  async addJobsBulk(jobs: RawEvent[]): Promise<void> {
    await this.queue.addBulk(
      jobs.map((rawEvent) => ({
        name: rawEvent.name,
        data: rawEvent,
      })),
    );
  }
}
