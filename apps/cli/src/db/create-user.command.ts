import { Command } from 'commander';
import type pg from 'pg';
import { CONTAINER, PG } from '../shared/container.js';
import inquirer from 'inquirer';

export const CREATE_USER_COMMAND = new Command('create-user')
  .requiredOption(`--username <string>`)
  .action(async ({ username }: Options) => {
    const pgClient = CONTAINER.get<pg.Client>(PG);

    const { password } = await inquirer.prompt<Prompts>({
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
