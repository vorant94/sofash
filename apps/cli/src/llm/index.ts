import { Command } from 'commander';
import { HEALTH_COMMAND } from './health.command.js';

export const LLM_COMMAND = new Command('llm').addCommand(HEALTH_COMMAND);
