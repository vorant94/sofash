import { Command } from '@oclif/core';
import { envMixin } from '../../shared/env.mixin.js';
import { pgMixin } from '../../shared/pg.mixin.js';
import { DB_NAME } from 'db';
import { onlyInDevMixin } from '../../shared/only-in-dev.mixin.js';

export default class Create extends onlyInDevMixin(pgMixin(envMixin(Command))) {
  async run(): Promise<void> {
    await this.withPg(async (pg) => {
      await pg.query(`CREATE DATABASE ${DB_NAME}`);
    });
  }
}
