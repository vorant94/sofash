import { Command, Flags } from '@oclif/core';
import { envMixin } from '../../shared/env.mixin.js';
import { pgMixin } from '../../shared/pg.mixin.js';
import { onlyInDevMixin } from '../../shared/only-in-dev.mixin.js';

export default class DropUser extends onlyInDevMixin(
  pgMixin(envMixin(Command)),
) {
  static flags = {
    username: Flags.string({ required: true }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(DropUser);

    await this.usingPg(async (pg) => {
      await pg.query(`DROP USER ${flags.username}`);
    });
  }
}
