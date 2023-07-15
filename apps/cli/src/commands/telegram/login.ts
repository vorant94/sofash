import { Command } from '@oclif/core';
import { telegramMixin } from '../../shared/telegram.mixin.js';
import { envMixin } from '../../shared/env.mixin.js';

export default class Login extends telegramMixin(envMixin(Command)) {
  async run(): Promise<void> {
    await this.telegram.login();
  }
}
