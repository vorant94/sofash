import { type Job, Queue, Worker } from 'bullmq';
import { type Redis } from 'ioredis';
import { type RawEventJob } from './raw-event.job.js';

export class RawEventQueue {
  readonly #queueName = 'raw-event';
  readonly #connection: Redis;
  readonly #queue: Queue;
  readonly #workers: Array<Worker<RawEventJob, void, string>> = [];

  constructor(connection: Redis) {
    this.#connection = connection;

    this.#queue = new Queue(this.#queueName, {
      connection,
    });
  }

  async queueJobs(jobs: RawEventJob[]): Promise<void> {
    await this.#queue.addBulk(
      jobs.map((rawEvent) => ({
        name: rawEvent.name,
        data: rawEvent,
      })),
    );
  }

  addWorker(processor: (job: RawEventJob) => Promise<void>): void {
    this.#workers.push(
      new Worker(
        this.#queueName,
        async (job: Job<RawEventJob, void, string>) => {
          await processor(job.data);
        },
        { connection: this.#connection },
      ),
    );
  }

  async closeWorkers(): Promise<void> {
    await Promise.all(
      this.#workers.map(async (worker) => {
        await worker.close(true);
      }),
    );
  }
}
