import http, { type Server } from 'http';
import { type Express } from 'express';
import { createTerminus } from '@godaddy/terminus';
import {
  CONTAINER,
  DB,
  ENV,
  LOGGER,
  MQ,
  TELEGRAF,
} from '../shared/container.js';
import { type Telegraf } from 'telegraf';
import { type Db } from 'db';
import { type Mq } from 'mq';
import { type Logger } from 'logger';
import { createTelegrafWebhookUrl } from '../shared/create-telegraf-webhook-url.js';
import { type Env } from './env.js';

export function createServer(app: Express, manageWebhook: boolean): Server {
  const env = CONTAINER.get<Env>(ENV);
  const telegraf = CONTAINER.get<Telegraf>(TELEGRAF);
  const db = CONTAINER.get<Db>(DB);
  const mq = CONTAINER.get<Mq>(MQ);
  const logger = CONTAINER.get<Logger>(LOGGER);

  const server = http.createServer(app);

  return createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: {
      '/health': onHealthCheckFactory(env, telegraf, db, logger),
    },
    onSignal: onSignalFactory(telegraf, db, mq, logger, manageWebhook),
  });
}

// TODO add console logs in case something didn't shut down successfully
function onSignalFactory(
  telegraf: Telegraf,
  db: Db,
  mq: Mq,
  logger: Logger,
  manageWebhook: boolean,
): () => Promise<void> {
  return async () => {
    logger.info('server is cleaning up');

    await Promise.allSettled([
      manageWebhook ? telegraf.telegram.deleteWebhook() : null,
      db.destroy(),
      mq.quit(),
    ]);
  };
}

// TODO add health check for
//  - redis
function onHealthCheckFactory(
  env: Env,
  telegraf: Telegraf,
  db: Db,
  logger: Logger,
): () => Promise<Record<string, boolean>> {
  return async (): Promise<Record<string, boolean>> => {
    logger.info('server is checking health');

    const [telegrafRes, dbRes] = await Promise.allSettled([
      telegraf.telegram.getWebhookInfo(),
      db.health(),
    ]);

    const telegrafWebhookUrl = createTelegrafWebhookUrl(env);

    return {
      db: dbRes.status === 'fulfilled',
      telegraf:
        telegrafRes.status === 'fulfilled' &&
        telegrafRes.value.url === telegrafWebhookUrl.toString(),
    };
  };
}
