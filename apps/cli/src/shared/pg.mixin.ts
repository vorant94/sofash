import { type Command } from '@oclif/core';
import { type AbstractConstructor } from './constructor.js';
import { type HasEnv } from './env.mixin.js';
import pg from 'pg';

export type CanHavePg = AbstractConstructor<HasEnv>;

export interface HasPg extends Command {
  withPg: <T>(callback: (pg: pg.Client) => Promise<T>) => Promise<T>;
}

export function pgMixin<T extends CanHavePg>(
  base: T,
): AbstractConstructor<HasPg> & T {
  abstract class BaseWithMixin extends base {
    private pg!: pg.Client;

    async withPg<T>(callback: (pg: pg.Client) => Promise<T>): Promise<T> {
      await this.pg.connect();

      try {
        return await callback(this.pg);
      } finally {
        await this.pg.end();
      }
    }

    protected async init(): Promise<any> {
      const superRes = await super.init();

      this.pg = new pg.Client({
        host: this.env.DB_HOST,
        port: this.env.DB_PORT,
        user: this.env.DB_ROOT_USERNAME,
        password: this.env.DB_ROOT_PASSWORD,
      });

      return superRes;
    }
  }

  return BaseWithMixin;
}
