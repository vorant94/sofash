import { type Command } from '@oclif/core';
import { type AbstractConstructor } from './constructor.js';
import { BASE_SCHEMA, type BaseEnv, parseEnv } from 'env';
import joi, { type ObjectSchema } from 'joi';

export type CanHaveEnv = AbstractConstructor<Command>;

export interface HasEnv extends Command {
  env: Env;
}

export interface Env extends BaseEnv {
  TG_CLIENT_API_ID: number;
  TG_CLIENT_API_HASH: string;
  DB_ROOT_USERNAME: string;
  DB_ROOT_PASSWORD: string;
}

export function envMixin<T extends CanHaveEnv>(
  base: T,
): AbstractConstructor<HasEnv> & T {
  abstract class BaseWithMixin extends base {
    env!: Env;

    readonly #envSchema: ObjectSchema<Env> = BASE_SCHEMA.append<Env>({
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

    protected async init(): Promise<any> {
      const superRes = await super.init();

      this.env = await parseEnv(this.#envSchema);

      return superRes;
    }
  }

  return BaseWithMixin;
}
