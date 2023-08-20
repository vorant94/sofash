import express from 'express';
import { type Env, ENV_SCHEMA } from './core/env.js';
import { type Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { parseEnv } from 'env';
import { type Db } from 'db';
import {
  CONTAINER,
  DB,
  ENV,
  LOGGER,
  MQ,
  TELEGRAF,
} from './shared/container.js';
import { type Mq } from 'mq';
import { createEventProcessor } from './event/create-event.processor.js';
import { createLogger } from './core/create-logger.js';
import { type Logger } from 'logger';
import sourceMapSupport from 'source-map-support';
import { isMain } from './shared/is-main.js';
import { createServer } from './core/create-server.js';
import { type Server } from 'http';
import { createTelegrafMiddleware } from './core/create-telegraf-middleware.js';
import { createTelegraf } from './core/create-telegraf.js';
import { createDb } from './core/create-db.js';
import { createMq } from './core/create-mq.js';

if (isMain(import.meta.url)) {
  sourceMapSupport.install();

  const app = await main(true);
  const env = CONTAINER.get<Env>(ENV);
  const logger = CONTAINER.get<Logger>(LOGGER);

  app.listen(env.NODE_PORT, () => {
    logger.info(`server is listening on port ${env.NODE_PORT}`);
  });
}

export async function main(manageWebhook = false): Promise<Server> {
  const app = express();

  const env = await parseEnv(ENV_SCHEMA);
  CONTAINER.bind<Env>(ENV).toConstantValue(env);
  CONTAINER.bind<Logger>(LOGGER).toConstantValue(createLogger());
  const telegraf = createTelegraf(env);
  CONTAINER.bind<Telegraf>(TELEGRAF).toConstantValue(telegraf);
  CONTAINER.bind<Db>(DB).toConstantValue(await createDb(env));
  const mq = createMq(env);
  CONTAINER.bind<Mq>(MQ).toConstantValue(mq);

  mq.rawEvents.addWorker(createEventProcessor);
  mq.runWorkers();

  app.use(await createTelegrafMiddleware(manageWebhook));
  telegraf.on(message(), async (ctx) => {
    await ctx.reply('Hello');
  });

  return createServer(app, manageWebhook);
}
