import { type Express, type RequestHandler } from 'express';
import { asyncMiddleware } from '../shared/async-middleware.js';

export async function createTelegrafMiddleware(
  app: Express,
): Promise<RequestHandler> {
  const { telegraf, env } = app.locals;

  const webhook = await telegraf.createWebhook({
    domain: env.TG_BOT_WEBHOOK_URL,
  });

  return asyncMiddleware(webhook);
}
