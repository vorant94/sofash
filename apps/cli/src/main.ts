import { Command } from 'commander';
import { PG_COMMAND } from './pg/index.js';
import { SCRAP_COMMAND } from './scrap/index.js';
import { parseEnv } from 'env';
import { type Env, ENV_SCHEMA } from './core/env.js';
import { EVENT_SOURCE_COMMAND } from './event-source/index.js';
import { TELEGRAM_COMMAND } from './telegram/index.js';
import { createPg } from './core/create-pg.js';
import { createDb } from './core/create-db.js';
import { createTelegram } from './core/create-telegram.js';
import {
  CONTAINER,
  DB,
  ENV,
  LLM,
  LOGGER,
  MQ,
  PG,
  TELEGRAF,
  TELEGRAM,
} from './shared/container.js';
import type pg from 'pg';
import { type Db } from 'db';
import { type Client } from 'tdl';
import { type Logger } from 'logger';
import { createLogger } from './core/create-logger.js';
import { install } from 'source-map-support';
import { type Telegraf } from 'telegraf';
import { createTelegraf } from './core/create-telegraf.js';
import { type Llm } from 'llm';
import { createLlm } from './core/create-llm.js';
import { LLM_COMMAND } from './llm/index.js';
import { type Mq } from 'mq';
import { createMq } from './core/create-mq.js';

install();

const program = new Command();

const env = await parseEnv(ENV_SCHEMA);
CONTAINER.bind<Env>(ENV).toConstantValue(env);
CONTAINER.bind<pg.Client>(PG).toConstantValue(await createPg(program, env));
CONTAINER.bind<Db>(DB).toConstantValue(await createDb(program, env));
CONTAINER.bind<Client>(TELEGRAM).toConstantValue(createTelegram(program, env));
CONTAINER.bind<Mq>(MQ).toConstantValue(createMq(program, env));
CONTAINER.bind<Logger>(LOGGER).toConstantValue(createLogger());
CONTAINER.bind<Telegraf>(TELEGRAF).toConstantValue(createTelegraf(env));
CONTAINER.bind<Llm>(LLM).toConstantValue(createLlm(env));

await program
  .addCommand(PG_COMMAND)
  .addCommand(EVENT_SOURCE_COMMAND)
  .addCommand(SCRAP_COMMAND)
  .addCommand(TELEGRAM_COMMAND)
  .addCommand(LLM_COMMAND)
  .parseAsync();
