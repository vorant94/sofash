import fs from 'fs-extra';
import path from 'path';
import { config } from 'dotenv';
import joi, { type ObjectSchema } from 'joi';
import { LOG_LEVELS, type LogLevel } from 'logger';

export interface BaseEnv {
  NODE_ENV: NodeEnv;
  LOG_LEVEL: LogLevel;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  MQ_HOST: string;
  MQ_PORT: number;
  TG_BOT_TOKEN: string;
  TG_BOT_WEBHOOK_URL: string;
  LLM_API_KEY: string;
}

export const NODE_ENVS = ['development', 'production'] as const;
export type NodeEnv = (typeof NODE_ENVS)[number];

export async function parseEnv<T extends BaseEnv>(
  schema: ObjectSchema<T>,
): Promise<T> {
  const isDotenvPresent = await fs.exists(path.resolve('./.env'));
  if (isDotenvPresent) {
    const { error } = config({ override: true });
    if (error != null) {
      throw new Error(error.message);
    }
  }

  const { value, error } = schema.validate(process.env);
  if (error != null) {
    throw new Error(error.message);
  }

  return value;
}

export const BASE_SCHEMA = joi
  .object<BaseEnv, true>({
    NODE_ENV: joi
      .string()
      .allow(...NODE_ENVS)
      .required(),
    LOG_LEVEL: joi
      .string()
      .allow(...LOG_LEVELS)
      .optional()
      .default('info'),
    DB_HOST: joi.string().when('NODE_ENV', {
      is: 'development',
      then: joi.optional().default('localhost'),
      otherwise: joi.required(),
    }),
    DB_PORT: joi.number().optional().default(5432),
    DB_USERNAME: joi.string().when('NODE_ENV', {
      is: 'development',
      then: joi.optional().default('sofash'),
      otherwise: joi.required(),
    }),
    DB_PASSWORD: joi.string().when('NODE_ENV', {
      is: 'development',
      then: joi.optional().default('password'),
      otherwise: joi.required(),
    }),
    MQ_HOST: joi.string().when('NODE_ENV', {
      is: 'development',
      then: joi.optional().default('localhost'),
      otherwise: joi.required(),
    }),
    MQ_PORT: joi.number().optional().default(6379),
    TG_BOT_TOKEN: joi.string().required(),
    TG_BOT_WEBHOOK_URL: joi.string().required(),
    LLM_API_KEY: joi.string().required(),
  })
  .options({ stripUnknown: true });
