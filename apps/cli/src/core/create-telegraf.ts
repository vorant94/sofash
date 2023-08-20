import { type Env } from './env.js';
import { Telegraf } from 'telegraf';

export function createTelegraf(env: Env): Telegraf {
  return new Telegraf(env.TG_BOT_TOKEN);
}
