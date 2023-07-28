import http, { type Server } from 'http';
import { type Express, type Locals } from 'express';
import { createTerminus } from '@godaddy/terminus';

export function createServer(app: Express): Server {
  const server = http.createServer(app);

  return createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: { '/health': onHealthCheckFactory(app.locals) },
    onSignal: onSignalFactory(app.locals),
  });
}

// TODO add console logs in case something didn't shut down successfully
function onSignalFactory({ telegraf, db }: Locals): () => Promise<void> {
  return async () => {
    console.log('server is cleaning up');
    await Promise.allSettled([telegraf.telegram.deleteWebhook(), db.destroy()]);
  };
}

// TODO add health check for
//  - postgres
//  - redis (once added to the project)
function onHealthCheckFactory(_: Locals): () => Promise<any> {
  return async () => {
    console.log('server is checking health');
    await Promise.resolve();
  };
}
