import { type Command } from '@oclif/core';
import { type AbstractConstructor } from './constructor.js';
import { type HasEnv } from './env.mixin.js';
import { Db } from 'db';

export type CanHaveDb = AbstractConstructor<HasEnv>;

export interface HasDb extends Command {
  db: Db;
}

export function dbMixin<T extends CanHaveDb>(
  base: T,
): AbstractConstructor<HasDb> & T {
  abstract class BaseWithMixin extends base {
    db!: Db;

    async finally(error: Error | undefined): Promise<any> {
      await this.db.destroy();

      return await super.finally(error);
    }

    protected async init(): Promise<any> {
      const superRes = await super.init();

      this.db = new Db({
        host: this.env.DB_HOST,
        port: this.env.DB_PORT,
        username: this.env.DB_USERNAME,
        password: this.env.DB_PASSWORD,
      });

      await this.db.initialize();

      return superRes;
    }
  }

  return BaseWithMixin;
}
