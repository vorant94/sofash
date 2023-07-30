import { Command } from '@oclif/core';
import { envMixin } from '../shared/env.mixin.js';
import { dbMixin } from '../shared/db.mixin.js';
import { telegramMixin } from '../shared/telegram.mixin.js';
import { type EventSource, type EventSourceType } from 'db';
import { type Client } from 'tdl';
import { mqMixin } from '../shared/mq.mixin.js';
import { type RawEvent } from 'mq';
import { type Scrapper } from '../shared/scrapper.js';
import { TelegramChannel } from '../scrappers/telegram-channel.js';

export default class Scrap extends mqMixin(
  telegramMixin(dbMixin(envMixin(Command))),
) {
  async run(): Promise<void> {
    await this.usingTelegram(async (telegram) => {
      const eventSources = await this.#collectEventSources();

      const scrappers = this.#createScrappers(telegram);

      const results = await this.#processEventSources(eventSources, scrappers);

      this.#logResults(results);
    });
  }

  // TODO add flags to scrap
  //  - for all event sources
  //  - for all event sources of a specific type
  //  - for a specific event source by its uri
  async #collectEventSources(): Promise<EventSource[]> {
    const eventSources = await this.db.eventSources.findAll();

    this.log(`collected [${eventSources.length}] event sources to scrap`);
    return eventSources;
  }

  #createScrappers(telegram: Client): EventSourceTypeToScrapper {
    return new Map<EventSourceType, Scrapper>([
      // TODO fix proper generic types here to avoid manual type assertion
      ['telegram', new TelegramChannel(telegram) as Scrapper],
    ]);
  }

  async #processEventSources(
    eventSources: EventSource[],
    scrappers: EventSourceTypeToScrapper,
  ): Promise<EventSourceToResult> {
    const results = await Promise.allSettled(
      eventSources.map(async (eventSource) => {
        const scrapper = scrappers.get(eventSource.type);
        if (scrapper == null) {
          throw new Error(
            `No scrapper is configured for event source type [${eventSource.type}]`,
          );
        }

        await this.#processEventSource(eventSource, scrapper);
      }),
    );

    return new Map<EventSource, PromiseSettledResult<void>>(
      eventSources.map((eventSource, index) => [eventSource, results[index]]),
    );
  }

  async #processEventSource(
    eventSource: EventSource,
    scrapper: Scrapper,
  ): Promise<void> {
    const contents = await scrapper.scrapEventSource(eventSource);

    const latestScrappedMessageId = await this.#queueRawEventJobs(
      eventSource,
      scrapper,
      contents,
    );

    await this.#updateEventSourceLatestScrappedMessageId(
      eventSource,
      latestScrappedMessageId,
    );
  }

  async #queueRawEventJobs(
    eventSource: EventSource,
    scrapper: Scrapper,
    contents: Array<RawEvent['content']>,
  ): Promise<string> {
    if (contents.length === 0) {
      throw new Error(`Tried to queue raw events, but got empty array`);
    }

    const jobs: RawEvent[] = contents.map((content) =>
      scrapper.createRawEventJob(eventSource, content),
    );

    await this.mq.rawEvents.addJobsBulk(jobs);

    this.log(
      `successfully queued [${jobs.length}] raw event jobs for event source [${eventSource.uri}]`,
    );

    return scrapper.getScrappedMessageId(contents[0]);
  }

  async #updateEventSourceLatestScrappedMessageId(
    { id }: EventSource,
    latestScrappedMessageId: string,
  ): Promise<void> {
    await this.db.eventSources.updateLatestScrappedMessageId(
      id,
      latestScrappedMessageId,
    );
  }

  #logResults(esToResult: EventSourceToResult): void {
    const esUriToReason = new Map<string, string>();
    for (const [eventSource, result] of esToResult) {
      if (result.status === 'rejected') {
        esUriToReason.set(eventSource.uri, result.reason);
      }
    }

    const successCount = esToResult.size - esUriToReason.size;
    this.log(`successfully scrapped [${successCount}] event sources`);

    if (esUriToReason.size === 0) {
      this.log(`no event source failed to scrap`);
      return;
    }

    for (const [uri, reason] of esUriToReason) {
      this.log(
        `event source [${uri}] finished with errors [${JSON.stringify(
          reason,
          null,
          2,
        )}]`,
      );
    }
  }
}

type EventSourceToResult = Map<EventSource, PromiseSettledResult<void>>;
type EventSourceTypeToScrapper = Map<EventSourceType, Scrapper>;
