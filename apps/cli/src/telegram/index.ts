import { Command } from 'commander';
import { createGetChatHistoryCommand } from './get-chat-history.command.js';
import { createLoginCommand } from './login.command.js';
import { createLogoutCommand } from './logout.command.js';
import { type Client } from 'tdl';

export function createTelegramCommand(telegram: Client): Command {
  return new Command('telegram')
    .addCommand(createGetChatHistoryCommand(telegram))
    .addCommand(createLoginCommand(telegram))
    .addCommand(createLogoutCommand(telegram));
}
