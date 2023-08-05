import express from 'express';
import { type Env, ENV_SCHEMA } from './core/env.js';
import { Telegraf } from 'telegraf';
import { createServer } from './core/create-server.js';
import { createTelegrafMiddleware } from './core/create-telegraf-middleware.js';
import { message } from 'telegraf/filters';
import { parseEnv } from 'env';
import { Db } from 'db';
import { CONTAINER, DB, ENV, MQ, TELEGRAF } from './shared/container.js';
import { Mq } from 'mq';
import { createEventProcessor } from './event/create-event.processor.js';

const app = express();

const env = await parseEnv(ENV_SCHEMA);
CONTAINER.bind<Env>(ENV).toConstantValue(env);
const telegraf = new Telegraf(env.TG_BOT_TOKEN);
CONTAINER.bind<Telegraf>(TELEGRAF).toConstantValue(telegraf);
const db = new Db({
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
});
CONTAINER.bind<Db>(DB).toConstantValue(db);
const mq = new Mq({
  host: env.MQ_HOST,
  port: env.MQ_PORT,
});
CONTAINER.bind<Mq>(MQ).toConstantValue(mq);

await db.initialize();

mq.rawEvents.addWorker(createEventProcessor);
mq.runWorkers();

app.use(await createTelegrafMiddleware());
telegraf.on(message(), async (ctx) => {
  await ctx.reply('Hello');
});

const server = createServer(app);
server.listen(env.NODE_PORT, () => {
  console.log(`server is listening on port ${env.NODE_PORT}`);
});
