import joi from 'joi';
import { BASE_SCHEMA, type BaseEnv } from 'env';

export interface Env extends BaseEnv {
  NODE_PORT: number;
  TG_BOT_TOKEN: string;
  TG_BOT_WEBHOOK_URL: string;
}

export const ENV_SCHEMA = BASE_SCHEMA.append<Env>({
  NODE_PORT: joi.number().optional().default(3000),
  TG_BOT_TOKEN: joi.string().required(),
  TG_BOT_WEBHOOK_URL: joi.string().required(),
});
