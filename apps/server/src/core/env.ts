import joi from 'joi';
import { BASE_SCHEMA, type BaseEnv } from 'env';

export interface Env extends BaseEnv {
  NODE_PORT: number;
}

export const ENV_SCHEMA = BASE_SCHEMA.append<Env>({
  NODE_PORT: joi.number().optional().default(3000),
});
