import { Mq } from 'mq';
import { type Env } from './env.js';

export function createMq(env: Env): Mq {
  const mq = new Mq({
    host: env.MQ_HOST,
    port: env.MQ_PORT,
  });

  return mq;
}
