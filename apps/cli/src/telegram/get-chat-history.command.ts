import { type Client } from 'tdl';
import { Command } from 'commander';
import { CONTAINER, LOGGER, TELEGRAM } from '../shared/container.js';
import { type Logger } from 'logger';

export const GET_CHAT_HISTORY_COMMAND = new Command('get-chat-history')
  .requiredOption(`--username <string>`)
  .action(async ({ username }: Options) => {
    const telegram = CONTAINER.get<Client>(TELEGRAM);
    const logger = CONTAINER.get<Logger>(LOGGER).clone('GetChatHistoryCommand');

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

    logger.info(`got messages`, { messages });
  });

interface Options {
  username: string;
}
