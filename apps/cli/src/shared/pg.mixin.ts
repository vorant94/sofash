import { type Command } from '@oclif/core';
import { type AbstractConstructor } from './constructor.js';
import { type HasEnv } from './env.mixin.js';
import pg from 'pg';

export type CanHavePg = AbstractConstructor<HasEnv>;

export interface HasPg extends Command {
  pg: pg.Client;
}

export function pgMixin<T extends CanHavePg>(
  base: T,
): AbstractConstructor<HasPg> & T {
  abstract class BaseWithMixin extends base {
    pg!: pg.Client;

    protected async init(): Promise<any> {
      const superRes = await super.init();

      this.pg = new pg.Client({
        host: this.env.DB_HOST,
        port: this.env.DB_PORT,
        user: this.env.DB_ROOT_USERNAME,
        password: this.env.DB_ROOT_PASSWORD,
      });

      await this.pg.connect();

      return superRes;
    }

    protected async finally(error: Error | undefined): Promise<any> {
      await this.pg.end();

      super.finally(error);
    }
  }

  return BaseWithMixin;
}
