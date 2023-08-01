import { Command } from 'commander';
import { GET_CHAT_HISTORY_COMMAND } from './get-chat-history.command.js';
import { LOGIN_COMMAND } from './login.command.js';
import { LOGOUT_COMMAND } from './logout.command.js';

export const TELEGRAM_COMMAND = new Command('telegram')
  .addCommand(GET_CHAT_HISTORY_COMMAND)
  .addCommand(LOGIN_COMMAND)
  .addCommand(LOGOUT_COMMAND);
