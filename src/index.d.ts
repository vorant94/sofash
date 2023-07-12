import { type Telegraf } from 'telegraf';
import { type Env } from './core/create-env.js';

declare global {
  namespace Express {
    interface Locals {
      env: Env;
      telegraf: Telegraf;
    }
  }
}
