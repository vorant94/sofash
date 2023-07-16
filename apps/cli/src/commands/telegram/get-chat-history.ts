import { Command, Flags } from '@oclif/core';
import { telegramMixin } from '../../shared/telegram.mixin.js';
import { envMixin } from '../../shared/env.mixin.js';

export default class GetChatHistory extends telegramMixin(envMixin(Command)) {
  static flags = {
    username: Flags.string({ required: true }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(GetChatHistory);

    const chat = await this.telegram.invoke({
      _: 'searchPublicChat',
      username: flags.username,
    });

    const history = await this.telegram.invoke({
      _: 'getChatHistory',
      chat_id: chat.id,
      limit: 10,
      only_local: false,
    });

    this.log(JSON.stringify(history.messages[0]?.content, null, 2));
  }
}
