import fs from 'fs-extra';
import path from 'path';
import { config } from 'dotenv';
import joi, { type ObjectSchema } from 'joi';

export interface BaseEnv {
  NODE_ENV: NodeEnv;
}

export const NODE_ENVS = ['DEV', 'PROD'] as const;
export type NodeEnv = (typeof NODE_ENVS)[number];

export async function parseEnv<T extends BaseEnv>(
  schema: ObjectSchema<T>,
): Promise<T> {
  const isDotenvPresent = await fs.exists(path.resolve('./.env'));
  if (isDotenvPresent) {
    const { error } = config();
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
  })
  .options({ stripUnknown: true });
