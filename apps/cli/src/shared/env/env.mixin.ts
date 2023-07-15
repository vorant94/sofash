import { type Command } from '@oclif/core';
import { type AbstractConstructor } from '../utility/constructor.js';
import { type Env } from './env.js';
import fs from 'fs-extra';
import path from 'path';
import { config } from 'dotenv';
import joi from 'joi';

export type CanHaveEnv = AbstractConstructor<Command>;

export interface HasEnv extends Command {
  env: Env;
}

export function envMixin<T extends CanHaveEnv>(
  base: T,
): AbstractConstructor<HasEnv> & T {
  abstract class BaseWithMixin extends base {
    env!: Env;

    private readonly envSchema = joi
      .object<Env, true>({
        NODE_ENV: joi.string().allow('DEV', 'PROD').required(),
        TG_CLIENT_API_ID: joi.number().required(),
        TG_CLIENT_API_HASH: joi.string().required(),
      })
      .options({ stripUnknown: true });

    protected async catch(error: Error): Promise<any> {
      this.log(`[Env Error]: ${JSON.stringify(error, null, 2)}`);
      return await super.catch(error);
    }

    protected async init(): Promise<any> {
      const superRes = await super.init();

      const isDotenvPresent = await fs.exists(path.resolve('./.env'));
      if (isDotenvPresent) {
        const { error } = config();
        if (error != null) {
          throw new Error(error.message);
        }
      }

      const { value, error } = this.envSchema.validate(process.env);
      if (error != null) {
        throw new Error(error.message);
      }

      this.env = value;

      return superRes;
    }
  }

  return BaseWithMixin;
}
