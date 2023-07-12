import http, { type Server } from 'http';
import { type Express } from 'express';
import { type Telegraf } from 'telegraf';
import { createTerminus } from '@godaddy/terminus';

export function createServer(app: Express): Server {
  const server = http.createServer(app);

  return createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: { '/health': onHealthCheck },
    onSignal: onSignalFactory(app.locals.telegraf),
  });
}

function onSignalFactory(telegraf: Telegraf): () => Promise<any> {
  return async () => {
    console.log('server is cleaning up');
    await Promise.all([telegraf.telegram.deleteWebhook()]);
  };
}

async function onHealthCheck(): Promise<any> {
  console.log('server is checking health');
  await Promise.resolve();
}
