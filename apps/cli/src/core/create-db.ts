import { Db, type DbOptions } from 'db';
import { type Command } from 'commander';
import { type Env } from './env.js';
import fs from 'fs-extra';
import path from 'path';

export async function createDb(program: Command, env: Env): Promise<Db> {
  let ssl: DbOptions['ssl'];
  if (env.NODE_ENV !== 'DEV') {
    ssl = {
      // download file from here https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html
      ca: await fs.readFile(path.resolve('./global-bundle.pem')),
    };
  }

  const db = new Db({
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    ssl,
  });

  // program
  //   .hook('preAction', async () => {
  //     await db.initialize();
  //   })
  //   .hook('postAction', async () => {
  //     await db.destroy();
  //   });

  return db;
}
