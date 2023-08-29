import { Command } from 'commander';
import { CONTAINER, LLM, LOGGER } from '../shared/container.js';
import { type Logger } from 'logger';
import { type Llm } from 'llm';

export const HEALTH_COMMAND = new Command('health').action(async () => {
  const llm = CONTAINER.get<Llm>(LLM);
  const logger = CONTAINER.get<Logger>(LOGGER).clone('health');

  const res = await llm.health();
  logger.info(JSON.stringify(res, null, 2));
});
