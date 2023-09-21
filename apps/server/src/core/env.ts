import joi from 'joi';
import { BASE_ENV_SCHEMA, type BaseEnv } from 'env';

export interface Env extends BaseEnv {
  NODE_PORT: number;
}

export const ENV_SCHEMA = BASE_ENV_SCHEMA.append<Env>({
  NODE_PORT: joi.number().optional().default(3000),
});
