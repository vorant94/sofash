import { Command } from 'commander';
import { CONTAINER, ENV, TELEGRAF } from '../shared/container.js';
import { type Env } from '../core/env.js';
import { type Telegraf } from 'telegraf';

export const SET_WEBHOOK_COMMAND = new Command('set-webhook').action(
  async () => {
    const env = CONTAINER.get<Env>(ENV);
    const telegraf = CONTAINER.get<Telegraf>(TELEGRAF);

    await telegraf.telegram.setWebhook(env.TG_BOT_WEBHOOK_URL);
  },
);
