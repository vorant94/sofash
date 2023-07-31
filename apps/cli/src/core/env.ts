import joi, { type ObjectSchema } from 'joi';
import { BASE_SCHEMA, type BaseEnv } from 'env';

export interface Env extends BaseEnv {
  TG_CLIENT_API_ID: number;
  TG_CLIENT_API_HASH: string;
  DB_ROOT_USERNAME: string;
  DB_ROOT_PASSWORD: string;
}

export const ENV_SCHEMA: ObjectSchema<Env> = BASE_SCHEMA.append<Env>({
  TG_CLIENT_API_ID: joi.number().required(),
  TG_CLIENT_API_HASH: joi.string().required(),
  DB_ROOT_USERNAME: joi.string().when('NODE_ENV', {
    is: 'DEV',
    then: joi.optional().default('postgres'),
    otherwise: joi.required(),
  }),
  DB_ROOT_PASSWORD: joi.string().when('NODE_ENV', {
    is: 'DEV',
    then: joi.optional().default('postgres'),
    otherwise: joi.required(),
  }),
});
