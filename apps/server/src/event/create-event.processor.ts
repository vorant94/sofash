import { type RawEventJob } from 'mq';
import { CONTAINER, LOGGER } from '../shared/container.js';
import { type Logger } from 'logger';

export async function createEventProcessor(
  rawEvent: RawEventJob,
): Promise<void> {
  const logger = CONTAINER.get<Logger>(LOGGER).clone('CreateEventProcessor');

  logger.info(`creating event for raw event ${rawEvent.name}`);
}
