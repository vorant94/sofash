import { type RequestHandler } from 'express';
import { asyncMiddleware } from '../shared/async-middleware.js';
import { CONTAINER, ENV, TELEGRAF } from '../shared/container.js';
import { type Telegraf } from 'telegraf';
import { type Env } from './env.js';

export async function createTelegrafMiddleware(): Promise<RequestHandler> {
  const env = CONTAINER.get<Env>(ENV);
  const telegraf = CONTAINER.get<Telegraf>(TELEGRAF);

  const webhook = await telegraf.createWebhook({
    domain: env.TG_BOT_WEBHOOK_URL,
  });

  return asyncMiddleware(webhook);
}
