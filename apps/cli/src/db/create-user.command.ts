import { Command } from 'commander';
import type pg from 'pg';
import prompts from 'prompts';
import { CONTAINER, PG } from '../shared/container.js';

export const CREATE_USER_COMMAND = new Command('create-user')
  .requiredOption(`--username <string>`)
  .action(async ({ username }: Options) => {
    const pgClient = CONTAINER.get<pg.Client>(PG);

    const { password }: Prompts = await prompts({
      name: 'password',
      type: 'password',
      message: 'What is your password?',
    });

    await pgClient.query(
      `CREATE USER ${username} WITH ENCRYPTED PASSWORD '${password}'`,
    );
  });

interface Options {
  username: string;
}

interface Prompts {
  password: string;
}
