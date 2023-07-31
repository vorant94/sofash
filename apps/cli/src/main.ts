import { Command } from 'commander';
import { createDbCommand } from './db/index.js';
import { createScrapCommand } from './scrap/index.js';
import { parseEnv } from 'env';
import { ENV_SCHEMA } from './core/env.js';
import { createEventSourceCommand } from './event-source/index.js';
import { createTelegramCommand } from './telegram/index.js';
import { createPg } from './core/create-pg.js';
import { createDb } from './core/create-db.js';
import { createTelegram } from './core/create-telegram.js';
import { createMq } from './core/create-mq.js';

const env = await parseEnv(ENV_SCHEMA);

const program = new Command();

const pg = createPg(program, env);
const db = createDb(program, env);
const telegram = createTelegram(program, env);
const mq = createMq(program, env);

await program
  .addCommand(createDbCommand(pg, env))
  .addCommand(createEventSourceCommand(db))
  .addCommand(createScrapCommand(db, telegram, mq))
  .addCommand(createTelegramCommand(telegram))
  .parseAsync();
