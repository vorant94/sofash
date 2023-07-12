import fs from 'fs-extra';
import path from 'path';
import { config } from 'dotenv';
import joi from 'joi';

export async function createEnv(): Promise<Env> {
  const isDotenvPresent = await fs.exists(path.resolve('./.env'));
  if (isDotenvPresent) {
    const { error } = config();
    if (error != null) {
      throw new Error(error.message);
    }
  }

  const { value, error } = joi
    .object<Env, true>({
      NODE_ENV: joi.string().allow('DEV', 'PROD').required(),
      NODE_PORT: joi.number().optional().default(3000),
      TG_BOT_TOKEN: joi.string().required(),
      TG_BOT_WEBHOOK_URL: joi.string().required(),
    })
    .options({ stripUnknown: true })
    .validate(process.env);
  if (error != null) {
    throw new Error(error.message);
  }

  return value;
}

export interface Env {
  NODE_ENV: NodeEnv;
  NODE_PORT: number;
  TG_BOT_TOKEN: string;
  TG_BOT_WEBHOOK_URL: string;
}

export type NodeEnv = 'DEV' | 'PROD';
