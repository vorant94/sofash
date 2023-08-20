import { Db } from 'db';
import { type Env } from './env.js';

export async function createDb(env: Env): Promise<Db> {
  const db = new Db({
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
  });

  await db.initialize();

  return db;
}
