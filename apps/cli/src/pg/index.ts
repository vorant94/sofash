import { Command } from 'commander';
import { HEALTH_COMMAND } from './health.command.js';

export const PG_COMMAND = new Command('pg').addCommand(HEALTH_COMMAND);
