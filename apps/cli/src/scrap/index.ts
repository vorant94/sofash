import { Command } from 'commander';
import { type Db, type EventSourceEntity, type EventSourceType } from 'db';
import { type Client } from 'tdl';
import { TelegramChannelScrapper } from './scrappers/telegram-channel.scrapper.js';
import { type Mq, type RawEventJob } from 'mq';
import { type Scrapper } from './scrappers/scrapper.js';
import { CONTAINER, DB, LOGGER, MQ, TELEGRAM } from '../shared/container.js';
import { type Logger } from 'logger';

// TODO add options to scrap
//  - for all event sources
//  - for all event sources of a specific type
//  - for a specific event source by its uri
export const SCRAP_COMMAND = new Command('scrap').action(async () => {
  const db = CONTAINER.get<Db>(DB);
  const telegram = CONTAINER.get<Client>(TELEGRAM);
  const mq = CONTAINER.get<Mq>(MQ);
  const logger = CONTAINER.get<Logger>(LOGGER).clone('ScrapCommand');

  //
  // collect event sources
  //
  const eventSources = await db.eventSources.findAll();
  logger.info(`collected [${eventSources.length}] event sources to scrap`);

  //
  // configure scrappers
  //
  const scrappers = new Map<EventSourceType, Scrapper>([
    // TODO fix proper generic types here to avoid manual type assertion
    ['telegram', new TelegramChannelScrapper(telegram, logger) as Scrapper],
  ]);

  //
  // process all event sources in parallel
  //
  const results = await Promise.allSettled(
    eventSources.map(async (eventSource) => {
      const scrapper = scrappers.get(eventSource.type);
      if (scrapper == null) {
        throw new Error(
          `No scrapper is configured for event source type [${eventSource.type}]`,
        );
      }

      //
      // scrap event source
      //
      const contents = await scrapper.scrapEventSource(eventSource);
      if (contents.length === 0) {
        return;
      }

      //
      // queue raw event jobs
      //
      const jobs: RawEventJob[] = contents.map((content) =>
        scrapper.createRawEventJob(eventSource, content),
      );
      await mq.rawEvents.queueJobs(jobs);
      logger.info(
        `successfully queued [${jobs.length}] raw event jobs for event source [${eventSource.uri}]`,
        { uri: eventSource.uri },
      );

      //
      // update latest scrapped message id
      //
      await db.eventSources.updateLatestScrappedMessageId(
        eventSource.id,
        scrapper.getScrappedMessageId(contents[0]),
      );
    }),
  );

  const esToResult = new Map<EventSourceEntity, PromiseSettledResult<void>>(
    eventSources.map((eventSource, index) => [eventSource, results[index]]),
  );

  //
  // log results
  //
  const esUriToReason = new Map<string, any>();
  for (const [eventSource, result] of esToResult) {
    if (result.status === 'rejected') {
      esUriToReason.set(eventSource.uri, result.reason);
    }
  }

  const successCount = esToResult.size - esUriToReason.size;
  logger.info(`successfully scrapped [${successCount}] event sources`);

  if (esUriToReason.size === 0) {
    logger.info(`no event source failed to scrap`);
    return;
  }

  for (const [uri, reason] of esUriToReason) {
    const message =
      reason instanceof Error
        ? reason.message
        : JSON.stringify(reason, null, 2);

    logger.error(`event source [${uri}] finished with errors [${message}]`, {
      uri,
    });
  }
});
