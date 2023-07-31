import { Command } from 'commander';
import type pg from 'pg';
import { DB_NAME } from 'db';
import { onlyInDev } from '../shared/only-in-dev.js';
import { type Env } from '../core/env.js';

export function createDropCommand(env: Env, pgClient: pg.Client): Command {
  return new Command('drop')
    .hook('preAction', async () => {
      onlyInDev(env);
    })
    .action(async () => {
      await pgClient.query(`DROP DATABASE ${DB_NAME}`);
    });
}
