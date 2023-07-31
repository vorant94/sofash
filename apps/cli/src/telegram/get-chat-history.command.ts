import { type Client } from 'tdl';
import { Command } from 'commander';

export function createGetChatHistoryCommand(telegram: Client): Command {
  return new Command('get-chat-history')
    .requiredOption(`--username <string>`)
    .action(async ({ username }: Options) => {
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
}

interface Options {
  username: string;
}
