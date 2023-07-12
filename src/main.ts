import express from 'express';
import { createEnv } from './core/create-env.js';
import { Telegraf } from 'telegraf';
import { createHealthcheckMiddleware } from './core/create-healthcheck-middleware.js';
import { asyncMiddleware } from './shared/async-middleware.js';

void main();

async function main(): Promise<void> {
  const env = await createEnv();
  const bot = new Telegraf(env.TG_BOT_TOKEN);
  const app = express();

  app.locals = { env };

  app.use(
    asyncMiddleware(
      await bot.createWebhook({
        domain: env.TG_BOT_WEBHOOK_URL,
        path: '/telegram',
      }),
    ),
  );

  app.use('/health', createHealthcheckMiddleware());

  bot.on('text', async (ctx) => await ctx.reply('Hello'));

  app.listen(env.NODE_PORT, () => {
    console.log(`Example app listening on port ${env.NODE_PORT}`);
  });
}
