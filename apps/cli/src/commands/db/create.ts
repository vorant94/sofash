import { Command, Flags } from '@oclif/core';
import { envMixin } from '../../shared/env.mixin.js';
import { pgMixin } from '../../shared/pg.mixin.js';
import { DB_NAME } from 'db';

export default class Create extends pgMixin(envMixin(Command)) {
  static flags = {
    username: Flags.string({ required: true }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Create);

    await this.pg.query(`CREATE DATABASE ${DB_NAME} OWNER ${flags.username}`);
  }
}
