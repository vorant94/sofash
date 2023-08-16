import { Command } from 'commander';
import { CREATE_COMMAND } from './create.command.js';
import { CREATE_USER_COMMAND } from './create-user.command.js';
import { DROP_COMMAND } from './drop.command.js';
import { DROP_USER_COMMAND } from './drop-user.command.js';
import { HEALTH_COMMAND } from './health.command.js';

export const DB_COMMAND = new Command('db')
  .addCommand(CREATE_COMMAND)
  .addCommand(CREATE_USER_COMMAND)
  .addCommand(DROP_COMMAND)
  .addCommand(DROP_USER_COMMAND)
  .addCommand(HEALTH_COMMAND);
