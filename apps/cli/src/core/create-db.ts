import { Db } from 'db';
import { type Command } from 'commander';
import { type Env } from './env.js';

export async function createDb(program: Command, env: Env): Promise<Db> {
  const db = new Db({
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
  });

  program
    .hook('preAction', async () => {
      await db.initialize();
    })
    .hook('postAction', async () => {
      await db.destroy();
    });

  return db;
}
