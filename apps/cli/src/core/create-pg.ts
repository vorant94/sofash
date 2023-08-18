import { type Command } from 'commander';
import pg from 'pg';
import { type Env } from './env.js';

export async function createPg(program: Command, env: Env): Promise<pg.Client> {
  const pgClient = new pg.Client({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
  });

  program
    .hook('preAction', async () => {
      await pgClient.connect();
    })
    .hook('postAction', async () => {
      await pgClient.end();
    });

  return pgClient;
}
