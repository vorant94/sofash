import { Command } from 'commander';
import type pg from 'pg';
import { DB_NAME } from 'db';
import { CONTAINER, PG } from '../shared/container.js';

export const CREATE_COMMAND = new Command('create')
  .requiredOption('--owner <string>')
  .action(async ({ owner }: Options) => {
    const pgClient = CONTAINER.get<pg.Client>(PG);

    await pgClient.query(`CREATE DATABASE ${DB_NAME} OWNER ${owner}`);
  });

interface Options {
  owner: string;
}
