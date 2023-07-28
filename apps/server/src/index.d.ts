import { type Telegraf } from 'telegraf';
import { type Env } from './core/env.js';
import { type Db } from 'db';

declare global {
  namespace Express {
    interface Locals {
      env: Env;
      telegraf: Telegraf;
      db: Db;
    }
  }
}
