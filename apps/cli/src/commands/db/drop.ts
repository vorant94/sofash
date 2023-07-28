import { Command } from '@oclif/core';
import { envMixin } from '../../shared/env.mixin.js';
import { pgMixin } from '../../shared/pg.mixin.js';
import { onlyInDevMixin } from '../../shared/only-in-dev.mixin.js';
import { DB_NAME } from 'db';

export default class Drop extends onlyInDevMixin(pgMixin(envMixin(Command))) {
  async run(): Promise<void> {
    await this.usingPg(async (pg) => {
      await pg.query(`DROP DATABASE ${DB_NAME}`);
    });
  }
}
