import { Command } from 'commander';
import { HEALTH_COMMAND } from './health.command.js';
import { EXTRACT_EVENT_DATA_COMMAND } from './extract-event-data.command.js';

export const LLM_COMMAND = new Command('llm')
  .addCommand(EXTRACT_EVENT_DATA_COMMAND)
  .addCommand(HEALTH_COMMAND);
