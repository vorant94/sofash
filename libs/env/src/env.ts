import fs from 'fs-extra';
import path from 'path';
import { config } from 'dotenv';
import joi, { type ObjectSchema } from 'joi';

export interface BaseEnv {
  NODE_ENV: NodeEnv;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  MQ_HOST: string;
  MQ_PORT: number;
}

export const NODE_ENVS = ['DEV', 'PROD'] as const;
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
    DB_HOST: joi.string().when('NODE_ENV', {
      is: 'DEV',
      then: joi.optional().default('localhost'),
      otherwise: joi.required(),
    }),
    DB_PORT: joi.number().optional().default(5432),
    DB_USERNAME: joi.string().when('NODE_ENV', {
      is: 'DEV',
      then: joi.optional().default('sofash'),
      otherwise: joi.required(),
    }),
    DB_PASSWORD: joi.string().when('NODE_ENV', {
      is: 'DEV',
      then: joi.optional().default('example'),
      otherwise: joi.required(),
    }),
    MQ_HOST: joi.string().when('NODE_ENV', {
      is: 'DEV',
      then: joi.optional().default('localhost'),
      otherwise: joi.required(),
    }),
    MQ_PORT: joi.number().optional().default(6379),
  })
  .options({ stripUnknown: true });
