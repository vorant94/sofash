import { Command, Flags } from '@oclif/core';
import { telegramMixin } from '../../shared/telegram.mixin.js';
import { envMixin } from '../../shared/env.mixin.js';

export default class GetChatHistory extends telegramMixin(envMixin(Command)) {
  static flags = {
    username: Flags.string({ required: true }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(GetChatHistory);

    const messages = await this.withTelegram(async (telegram) => {
      const { id } = await telegram.invoke({
        _: 'searchPublicChat',
        username: flags.username,
      });

      const { messages } = await telegram.invoke({
        _: 'getChatHistory',
        chat_id: id,
        limit: 10,
        only_local: false,
      });

      return messages;
    });

    this.log(JSON.stringify(messages, null, 2));
  }
}
