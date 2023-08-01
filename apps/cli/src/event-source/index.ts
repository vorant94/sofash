import { Command } from 'commander';
import { CREATE_COMMAND } from './create.command.js';
import { UPDATE_LATEST_SCRAPPED_MESSAGE_ID_COMMAND } from './update-latest-scrapped-message-id.command.js';

export const EVENT_SOURCE_COMMAND = new Command('event-source')
  .addCommand(CREATE_COMMAND)
  .addCommand(UPDATE_LATEST_SCRAPPED_MESSAGE_ID_COMMAND);
