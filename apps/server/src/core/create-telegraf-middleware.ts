import { type RequestHandler } from 'express';
import { asyncMiddleware } from '../shared/async-middleware.js';
import { CONTAINER, ENV, TELEGRAF } from '../shared/container.js';
import { type Telegraf } from 'telegraf';
import { type Env } from './env.js';
import { createTelegrafWebhookUrl } from '../shared/create-telegraf-webhook-url.js';

export async function createTelegrafMiddleware(
  manageWebhook: boolean,
): Promise<RequestHandler> {
  const env = CONTAINER.get<Env>(ENV);
  const telegraf = CONTAINER.get<Telegraf>(TELEGRAF);

  const webhookUrl = createTelegrafWebhookUrl(env);
  if (manageWebhook) {
    await telegraf.telegram.setWebhook(webhookUrl.toString());
  }

  return asyncMiddleware(telegraf.webhookCallback(webhookUrl.pathname));
}
