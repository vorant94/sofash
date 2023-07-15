import { Command, Flags } from '@oclif/core';
import { telegramMixin } from '../../shared/telegram.mixin.js';
import { envMixin } from '../../shared/env.mixin.js';

export default class GetChatHistory extends telegramMixin(envMixin(Command)) {
  static flags = {
    chatId: Flags.integer({ required: true }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(GetChatHistory);

    await this.telegram.invoke({
      _: 'getChats',
      chat_list: {
        _: 'chatListArchive',
      },
      limit: 100,
    });

    const history = await this.telegram.invoke({
      _: 'getChatHistory',
      chat_id: flags.chatId,
      limit: 10,
      only_local: false,
    });
    this.log(JSON.stringify(history.messages[0]?.content, null, 2));
  }
}
