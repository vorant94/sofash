import { Command, Flags, ux } from '@oclif/core';
import { envMixin } from '../../shared/env.mixin.js';
import { pgMixin } from '../../shared/pg.mixin.js';

export default class CreateUser extends pgMixin(envMixin(Command)) {
  static flags = {
    username: Flags.string({ required: true }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(CreateUser);

    const password = await ux.prompt('What is your password?', {
      type: 'mask',
    });

    await this.pg.query(
      `CREATE USER ${flags.username} WITH ENCRYPTED PASSWORD '${password}'`,
    );
  }
}
