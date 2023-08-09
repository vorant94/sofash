import { Command } from 'commander';
import { DB_COMMAND } from './db/index.js';
import { SCRAP_COMMAND } from './scrap/index.js';
import { parseEnv } from 'env';
import { type Env, ENV_SCHEMA } from './core/env.js';
import { EVENT_SOURCE_COMMAND } from './event-source/index.js';
import { TELEGRAM_COMMAND } from './telegram/index.js';
import { createPg } from './core/create-pg.js';
import { createDb } from './core/create-db.js';
import { createTelegram } from './core/create-telegram.js';
import { createMq } from './core/create-mq.js';
import {
  CONTAINER,
  DB,
  ENV,
  LOGGER,
  MQ,
  PG,
  TELEGRAM,
} from './shared/container.js';
import type pg from 'pg';
import { type Db } from 'db';
import { type Client } from 'tdl';
import { type Mq } from 'mq';
import { type Logger } from 'logger';
import { createLogger } from './core/create-logger.js';

const program = new Command();

const env = await parseEnv(ENV_SCHEMA);
CONTAINER.bind<Env>(ENV).toConstantValue(env);
CONTAINER.bind<pg.Client>(PG).toConstantValue(createPg(program, env));
CONTAINER.bind<Db>(DB).toConstantValue(createDb(program, env));
CONTAINER.bind<Client>(TELEGRAM).toConstantValue(createTelegram(program, env));
CONTAINER.bind<Mq>(MQ).toConstantValue(createMq(program, env));
CONTAINER.bind<Logger>(LOGGER).toConstantValue(createLogger());

await program
  .addCommand(DB_COMMAND)
  .addCommand(EVENT_SOURCE_COMMAND)
  .addCommand(SCRAP_COMMAND)
  .addCommand(TELEGRAM_COMMAND)
  .parseAsync();
