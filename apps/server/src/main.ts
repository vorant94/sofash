import express, { type Express } from 'express';
import { type Env, ENV_SCHEMA } from './core/env.js';
import { type Telegraf } from 'telegraf';
import { parseEnv } from 'env';
import { type Db } from 'db';
import {
  CONTAINER,
  DB,
  ENV,
  LLM,
  LOGGER,
  MQ,
  TELEGRAF,
} from './shared/container.js';
import { type Mq } from 'mq';
import { createParseProcessor } from './parse/parse.processor.js';
import { createLogger } from './core/create-logger.js';
import { type Logger } from 'logger';
import { install } from 'source-map-support';
import { isMain } from './shared/is-main.js';
import { createTelegraf } from './core/create-telegraf.js';
import { createDb } from './core/create-db.js';
import { createMq } from './core/create-mq.js';
import { setupGracefulShutdown } from './core/setup-graceful-shutdown.js';
import { handleAsyncRequest } from './shared/handle-async-request.js';
import { handleHealthRequest } from './health/index.js';
import { createTelegrafWebhookUrl } from './shared/create-telegraf-webhook-url.js';
import { COMPOSER } from './telegraf/index.js';
import { type Llm } from 'llm';
import { createLlm } from './core/create-llm.js';

if (isMain(import.meta.url)) {
  install();

  const app = await main(true);

  const env = CONTAINER.get<Env>(ENV);
  const logger = CONTAINER.get<Logger>(LOGGER);

  const server = app.listen(env.NODE_PORT, () => {
    logger.info(`server is listening on port ${env.NODE_PORT}`);
  });

  // TODO: upgrade ts and try to use using keyword (https://simonkoeck.medium.com/typescript-5-2s-using-keyword-managing-resources-with-ease-e0a31efa3eec#:~:text=The%20using%20keyword%20is%20designed,future%20addition%20to%20JavaScript%20itself.)
  setupGracefulShutdown(server, true);
}

export async function main(manageWebhook = false): Promise<Express> {
  const app = express();

  const env = await parseEnv(ENV_SCHEMA);
  CONTAINER.bind<Env>(ENV).toConstantValue(env);
  const logger = createLogger(env);
  CONTAINER.bind<Logger>(LOGGER).toConstantValue(logger);
  const telegraf = await createTelegraf(env, manageWebhook);
  CONTAINER.bind<Telegraf>(TELEGRAF).toConstantValue(telegraf);
  CONTAINER.bind<Db>(DB).toConstantValue(await createDb(env));
  const mq = createMq(env);
  CONTAINER.bind<Mq>(MQ).toConstantValue(mq);
  CONTAINER.bind<Llm>(LLM).toConstantValue(createLlm(env, logger));

  mq.rawEvents.addWorker(createParseProcessor());

  app.use('/health', handleAsyncRequest(handleHealthRequest));

  const webhookUrl = createTelegrafWebhookUrl(env);
  app.use(handleAsyncRequest(telegraf.webhookCallback(webhookUrl.pathname)));
  telegraf.use(COMPOSER);

  return app;
}
