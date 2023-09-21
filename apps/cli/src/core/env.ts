import joi, { type ObjectSchema } from 'joi';
import { BASE_ENV_SCHEMA, type BaseEnv } from 'env';

export interface Env extends BaseEnv {
  TG_CLIENT_API_ID: number;
  TG_CLIENT_API_HASH: string;
}

export const ENV_SCHEMA: ObjectSchema<Env> = BASE_ENV_SCHEMA.append<Env>({
  TG_CLIENT_API_ID: joi.number().required(),
  TG_CLIENT_API_HASH: joi.string().required(),
});
