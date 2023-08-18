import { Command } from 'commander';
import type pg from 'pg';
import { CONTAINER, LOGGER, PG } from '../shared/container.js';
import { type Logger } from 'logger';

export const HEALTH_COMMAND = new Command('health').action(async () => {
  const pgClient = CONTAINER.get<pg.Client>(PG);
  const logger = CONTAINER.get<Logger>(LOGGER).clone('health');

  await pgClient.query(`SELECT 1`);
  logger.info(`database is healthy`);
});
