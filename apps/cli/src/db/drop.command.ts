import { Command } from 'commander';
import type pg from 'pg';
import { DB_NAME } from 'db';
import { onlyInDev } from '../shared/only-in-dev.js';
import { type Env } from '../core/env.js';
import { CONTAINER, ENV, PG } from '../shared/container.js';

export const DROP_COMMAND = new Command('drop')
  .hook('preAction', async () => {
    const env = CONTAINER.get<Env>(ENV);

    onlyInDev(env);
  })
  .action(async () => {
    const pgClient = CONTAINER.get<pg.Client>(PG);

    await pgClient.query(`DROP DATABASE ${DB_NAME}`);
  });
