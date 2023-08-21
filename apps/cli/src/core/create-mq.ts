import { Mq } from 'mq';
import { type Command } from 'commander';
import { type Env } from './env.js';

export function createMq(program: Command, env: Env): Mq {
  const mq = new Mq({
    host: env.MQ_HOST,
    port: env.MQ_PORT,
  });

  program.hook('postAction', async () => {
    await mq.destroy();
  });

  return mq;
}
