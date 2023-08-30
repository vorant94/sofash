import { Command } from 'commander';
import { CONTAINER, LLM, LOGGER } from '../shared/container.js';
import { type Logger } from 'logger';
import { type Llm } from 'llm';
import path from 'path';
import fs from 'fs-extra';

const name = 'extract-event-data';

export const EXTRACT_EVENT_DATA_COMMAND = new Command(name)
  .requiredOption(`--promptPath <string>`, undefined, './prompt.txt')
  .action(async ({ promptPath }: Options) => {
    const llm = CONTAINER.get<Llm>(LLM);
    const logger = CONTAINER.get<Logger>(LOGGER).clone(name);

    const message = await fs.readFile(path.resolve(promptPath), {
      encoding: 'utf-8',
    });

    const res = await llm.extractEventData(message);
    logger.info(JSON.stringify(res, null, 2));
  });

interface Options {
  promptPath: string;
}
