import { type Telegraf } from 'telegraf';

export interface Context {
  env: Env;
  telegraf: Telegraf;
}

export interface Env {
  NODE_ENV: NodeEnv;
  NODE_PORT: number;
  TG_BOT_TOKEN: string;
  TG_BOT_WEBHOOK_URL: string;
}

export type NodeEnv = 'DEV' | 'PROD';
