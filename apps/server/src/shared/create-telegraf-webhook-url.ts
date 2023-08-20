import { type Env } from '../core/env.js';

export function createTelegrafWebhookUrl(env: Env): URL {
  return new URL(`${env.TG_BOT_WEBHOOK_URL}/telegraf`);
}
