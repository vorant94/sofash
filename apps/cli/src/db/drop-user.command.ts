import { Command } from 'commander';
import { onlyInDev } from '../shared/only-in-dev.js';
import type pg from 'pg';
import { type Env } from '../core/env.js';

export function createDropUserCommand(env: Env, pgClient: pg.Client): Command {
  return new Command('drop-user')
    .requiredOption(`--username <string>`)
    .hook('preAction', async () => {
      onlyInDev(env);
    })
    .action(async ({ username }: Options) => {
      await pgClient.query(`DROP USER ${username}`);
    });
}

interface Options {
  username: string;
}
