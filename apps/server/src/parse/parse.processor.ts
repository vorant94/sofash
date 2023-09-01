import { type RawEventJob, type RawEventProcessor } from 'mq';
import { CONTAINER, DB, LLM, LOGGER } from '../shared/container.js';
import { type Logger } from 'logger';
import { type Db, type EventSourceType } from 'db';
import { type Llm } from 'llm';
import { type Parser } from './parsers/parser.js';
import { TelegramParser } from './parsers/telegram.parser.js';

export function createParseProcessor(): RawEventProcessor {
  const logger = CONTAINER.get<Logger>(LOGGER).clone('parseProcessor');
  const db = CONTAINER.get<Db>(DB);
  const llm = CONTAINER.get<Llm>(LLM);

  const parsers = new Map<EventSourceType, Parser>([
    ['telegram', new TelegramParser(logger, llm) as Parser],
  ]);

  return async (rawEvent: RawEventJob): Promise<void> => {
    logger.debug(`started ${JSON.stringify(rawEvent, null, 2)}`);

    const parser = parsers.get(rawEvent.eventSource.type);
    if (parser == null) {
      throw new Error(
        `No parser is configured for event source type [${rawEvent.eventSource.type}]`,
      );
    }

    logger.info(`parsing raw event [${rawEvent.name}]`);
    const event = await parser.parseRawEventJob(rawEvent);

    logger.info(`saving event of raw event [${rawEvent.name}]`);
    await db.events.create(event);

    logger.debug(`finished`);
  };
}
