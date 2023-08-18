import { type Command } from 'commander';
import pg, { type ClientConfig } from 'pg';
import { type Env } from './env.js';
import fs from 'fs-extra';
import path from 'path';

export async function createPg(program: Command, env: Env): Promise<pg.Client> {
  let ssl: ClientConfig['ssl'];
  if (env.NODE_ENV !== 'DEV') {
    ssl = {
      // download file from here https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html
      ca: await fs.readFile(path.resolve('./global-bundle.pem')),
    };
  }

  const pgClient = new pg.Client({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    ssl,
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
