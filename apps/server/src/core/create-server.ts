import http, { type Server } from 'http';
import { type Express } from 'express';
import { createTerminus } from '@godaddy/terminus';
import { CONTAINER, DB, MQ, TELEGRAF } from '../shared/container.js';
import { type Telegraf } from 'telegraf';
import { type Db } from 'db';
import { type Mq } from 'mq';

export function createServer(app: Express): Server {
  const telegraf = CONTAINER.get<Telegraf>(TELEGRAF);
  const db = CONTAINER.get<Db>(DB);
  const mq = CONTAINER.get<Mq>(MQ);

  const server = http.createServer(app);

  return createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: { '/health': onHealthCheckFactory() },
    onSignal: onSignalFactory(telegraf, db, mq),
  });
}

// TODO add console logs in case something didn't shut down successfully
function onSignalFactory(
  telegraf: Telegraf,
  db: Db,
  mq: Mq,
): () => Promise<void> {
  return async () => {
    console.log('server is cleaning up');
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
function onHealthCheckFactory(): () => Promise<any> {
  return async () => {
    console.log('server is checking health');
    await Promise.resolve();
  };
}
