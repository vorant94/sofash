import { Command } from 'commander';
import { onlyInDev } from '../shared/only-in-dev.js';
import type pg from 'pg';
import { type Env } from '../core/env.js';
import { CONTAINER, ENV, PG } from '../shared/container.js';

export const DROP_USER_COMMAND = new Command('drop-user')
  .requiredOption(`--username <string>`)
  .hook('preAction', async () => {
    const env = CONTAINER.get<Env>(ENV);

    onlyInDev(env);
  })
  .action(async ({ username }: Options) => {
    const pgClient = CONTAINER.get<pg.Client>(PG);

    await pgClient.query(`DROP USER ${username}`);
  });

interface Options {
  username: string;
}
