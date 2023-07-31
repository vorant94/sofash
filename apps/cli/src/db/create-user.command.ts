import { Command } from 'commander';
import type pg from 'pg';
import prompts from 'prompts';

export function createCreateUserCommand(pgClient: pg.Client): Command {
  return new Command('create-user')
    .requiredOption(`--username <string>`)
    .action(async ({ username }: Options) => {
      const { password }: Prompts = await prompts({
        name: 'password',
        type: 'password',
        message: 'What is your passowrd?',
      });

      await pgClient.query(
        `CREATE USER ${username} WITH ENCRYPTED PASSWORD '${password}'`,
      );
    });
}

interface Options {
  username: string;
}

interface Prompts {
  password: string;
}
