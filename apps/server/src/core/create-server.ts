import http, { type Server } from 'http';
import { type Express } from 'express';
import { createTerminus } from '@godaddy/terminus';
import { CONTAINER, DB, LOGGER, MQ, TELEGRAF } from '../shared/container.js';
import { type Telegraf } from 'telegraf';
import { type Db } from 'db';
import { type Mq } from 'mq';
import { type Logger } from 'logger';

export function createServer(app: Express): Server {
  const telegraf = CONTAINER.get<Telegraf>(TELEGRAF);
  const db = CONTAINER.get<Db>(DB);
  const mq = CONTAINER.get<Mq>(MQ);
  const logger = CONTAINER.get<Logger>(LOGGER);

  const server = http.createServer(app);

  return createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: { '/health': onHealthCheckFactory(logger) },
    onSignal: onSignalFactory(telegraf, db, mq, logger),
  });
}

// TODO add console logs in case something didn't shut down successfully
function onSignalFactory(
  telegraf: Telegraf,
  db: Db,
  mq: Mq,
  logger: Logger,
): () => Promise<void> {
  return async () => {
    logger.info('server is cleaning up');

    await Promise.allSettled([
      telegraf.telegram.deleteWebhook(),
      db.destroy(),
      mq.quit(),
    ]);
  };
}

// TODO add health check for
//  - tg bot webhook
//  - postgres
//  - redis (once added to the project)
function onHealthCheckFactory(logger: Logger): () => Promise<any> {
  return async () => {
    logger.info('server is checking health');

    await Promise.resolve();
  };
}
