import { Command } from 'commander';
import type pg from 'pg';
import { CONTAINER, ENV, PG } from '../shared/container.js';
import { type Env } from '../core/env.js';
import inquirer from 'inquirer';

export const CREATE_USER_COMMAND = new Command('create-user')
  .requiredOption(`--username <string>`)
  .action(async ({ username }: Options) => {
    const env = CONTAINER.get<Env>(ENV);
    const pgClient = CONTAINER.get<pg.Client>(PG);

    const { password } = await inquirer.prompt<Prompts>({
      name: 'password',
      type: 'password',
      message: 'What is your password?',
    });

    await pgClient.query(
      `CREATE USER ${username} WITH ENCRYPTED PASSWORD '${password}'`,
    );

    if (env.NODE_ENV !== 'DEV') {
      // in AWS RDS root user must be granted permissions of the user,
      // that is going to be used as an owner of the actual db
      await pgClient.query(`GRANT ${username} TO ${env.DB_ROOT_USERNAME}`);
      // await pgClient.query(
      //   `GRANT USAGE, CREATE ON SCHEMA public TO ${username};`,
      // );
    }
  });

interface Options {
  username: string;
}

interface Prompts {
  password: string;
}
