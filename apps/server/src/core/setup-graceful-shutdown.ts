import process from 'process';
import { type Server } from 'http';
import { CONTAINER, DB, LOGGER, MQ, TELEGRAF } from '../shared/container.js';
import { type Telegraf } from 'telegraf';
import { type Db } from 'db';
import { type Mq } from 'mq';
import { type Logger } from 'logger';
import { promisify } from 'util';
import wrapShutdown from 'http-shutdown';

export function setupGracefulShutdown(): void;
export function setupGracefulShutdown(
  server: Server,
  manageWebhook: true,
): void;
export function setupGracefulShutdown(
  server?: Server,
  manageWebhook?: true,
): void {
  const telegraf = CONTAINER.get<Telegraf>(TELEGRAF);
  const db = CONTAINER.get<Db>(DB);
  const mq = CONTAINER.get<Mq>(MQ);
  const logger = CONTAINER.get<Logger>(LOGGER);

  let withShutdown: WithShutdown;
  if (server != null) {
    withShutdown = wrapShutdown(server);
  }

  const listener = (): void => {
    shutdownGracefully(telegraf, db, mq, logger, withShutdown, manageWebhook)
      .then(() => process.exit(0))
      .catch(({ message }) => {
        const logger = CONTAINER.get<Logger>(LOGGER);

        logger.error(message);
        process.exit(1);
      });
  };

  process.on('SIGINT', listener);
  process.on('SIGTERM', listener);
}

async function shutdownGracefully(
  telegraf: Telegraf,
  db: Db,
  mq: Mq,
  logger: Logger,
  server?: WithShutdown,
  manageWebhook?: true,
): Promise<void> {
  logger.info('server is cleaning up');

  await Promise.all([
    server != null ? promisify(server.shutdown)() : null,
    manageWebhook ? telegraf.telegram.deleteWebhook() : null,
    db.destroy(),
    mq.destroy(),
  ]);
}

type WithShutdown = ReturnType<typeof wrapShutdown>;
