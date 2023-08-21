import { type Env } from './env.js';
import { Telegraf } from 'telegraf';
import { createTelegrafWebhookUrl } from '../shared/create-telegraf-webhook-url.js';

export async function createTelegraf(
  env: Env,
  manageWebhook: boolean,
): Promise<Telegraf> {
  const telegraf = new Telegraf(env.TG_BOT_TOKEN);

  if (manageWebhook) {
    const webhookUrl = createTelegrafWebhookUrl(env);
    await telegraf.telegram.setWebhook(webhookUrl.toString());
  }

  return telegraf;
}
