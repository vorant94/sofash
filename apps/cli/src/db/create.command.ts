import { Command } from 'commander';
import type pg from 'pg';
import { DB_NAME } from 'db';

export function createCreateCommand(pgClient: pg.Client): Command {
  return new Command('create')
    .requiredOption('--owner <string>')
    .action(async ({ owner }: Options) => {
      await pgClient.query(`CREATE DATABASE ${DB_NAME} OWNER ${owner}`);
    });
}

interface Options {
  owner: string;
}
