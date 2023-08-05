import { type Job, Queue, Worker } from 'bullmq';
import { type Redis } from 'ioredis';
import { type RawEventJob } from './raw-event.job.js';
import { type EventEmitter } from 'events';
import { MqEvent } from '../shared/mq-event.js';

export class RawEventQueue {
  readonly #queueName = 'raw-event';
  readonly #connection: Redis;
  readonly #queue: Queue;
  readonly #workers: Array<Worker<RawEventJob, void, string>> = [];

  constructor(connection: Redis, mqEmitter: EventEmitter) {
    this.#connection = connection;

    this.#queue = new Queue(this.#queueName, {
      connection,
    });

    mqEmitter.on(MqEvent.RUN_WORKERS, () => {
      void this.#runWorkers();
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
        { autorun: false, connection: this.#connection },
      ),
    );
  }

  async #runWorkers(): Promise<void> {
    await Promise.allSettled(
      this.#workers.map(async (worker) => {
        await worker.run();
      }),
    );
  }
}
