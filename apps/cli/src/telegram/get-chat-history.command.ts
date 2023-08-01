import { type Client } from 'tdl';
import { Command } from 'commander';
import { CONTAINER, TELEGRAM } from '../shared/container.js';

export const GET_CHAT_HISTORY_COMMAND = new Command('get-chat-history')
  .requiredOption(`--username <string>`)
  .action(async ({ username }: Options) => {
    const telegram = CONTAINER.get<Client>(TELEGRAM);

    const { id } = await telegram.invoke({
      _: 'searchPublicChat',
      username,
    });

    const { messages } = await telegram.invoke({
      _: 'getChatHistory',
      chat_id: id,
      limit: 10,
      only_local: false,
    });

    console.log(JSON.stringify(messages, null, 2));
  });

interface Options {
  username: string;
}
