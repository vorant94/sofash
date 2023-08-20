import { Command } from 'commander';
import { CONTAINER, TELEGRAF } from '../shared/container.js';
import { type Telegraf } from 'telegraf';

export const DELETE_WEBHOOK_COMMAND = new Command('delete-webhook').action(
  async () => {
    const telegraf = CONTAINER.get<Telegraf>(TELEGRAF);

    await telegraf.telegram.deleteWebhook();
  },
);
