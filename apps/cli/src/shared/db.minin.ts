import { type Command } from '@oclif/core';
import { type AbstractConstructor } from './constructor.js';
import { configure } from 'tdl';
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

    protected async init(): Promise<any> {
      const superRes = await super.init();

      configure({
        verbosityLevel: 1,
      });

      this.db = new Db({
        host: this.env.DB_HOST,
        port: this.env.DB_PORT,
        username: this.env.DB_USERNAME,
        password: this.env.DB_PASSWORD,
        database: this.env.DB_DATABASE,
      });

      await this.db.initialize();

      return superRes;
    }
  }

  return BaseWithMixin;
}
