import express from 'express';
import { ENV_SCHEMA } from './core/env.js';
import { Telegraf } from 'telegraf';
import { createServer } from './core/create-server.js';
import { createTelegrafMiddleware } from './core/create-telegraf-middleware.js';
import { message } from 'telegraf/filters';
import { parseEnv } from 'env';
import { Db } from 'db';

const app = express();
const env = await parseEnv(ENV_SCHEMA);
const telegraf = new Telegraf(env.TG_BOT_TOKEN);
const db = new Db({
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
});
app.locals = { env, telegraf, db };

await db.initialize();

app.use(await createTelegrafMiddleware(app));

telegraf.on(message(), async (ctx) => {
  await ctx.reply('Hello');
});

const server = createServer(app);
server.listen(env.NODE_PORT, () => {
  console.log(`server is listening on port ${env.NODE_PORT}`);
});
