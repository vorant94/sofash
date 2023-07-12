import express from 'express';
import { createEnv } from './core/create-env.js';
import { Telegraf } from 'telegraf';
import { createServer } from './core/create-server.js';
import { createTelegrafMiddleware } from './core/create-telegraf-middleware.js';

void main();

async function main(): Promise<void> {
  const app = express();
  const env = await createEnv();
  const telegraf = new Telegraf(env.TG_BOT_TOKEN);
  app.locals = { env, telegraf };

  app.use(await createTelegrafMiddleware(app));

  telegraf.on('text', async (ctx) => await ctx.reply('Hello'));

  const server = createServer(app);
  server.listen(env.NODE_PORT, () => {
    console.log(`server is listening on port ${env.NODE_PORT}`);
  });
}
