import { Queue } from 'bullmq';
import { type Redis } from 'ioredis';
import { type RawEventJob } from './raw-event.job.js';

export class RawEventQueue {
  readonly #queue: Queue;

  constructor(connection: Redis) {
    this.#queue = new Queue('raw-event', {
      connection,
    });
  }

  async addJobsBulk(jobs: RawEventJob[]): Promise<void> {
    await this.#queue.addBulk(
      jobs.map((rawEvent) => ({
        name: rawEvent.name,
        data: rawEvent,
      })),
    );
  }
}
