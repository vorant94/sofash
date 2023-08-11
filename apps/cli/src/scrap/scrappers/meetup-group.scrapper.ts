import { type Scrapper } from './scrapper.js';
import { type MeetupRawEventJob } from 'mq';
import { type EventSourceEntity } from 'db';
import { type Logger } from 'logger';

export class MeetupGroupScrapper
  implements Scrapper<EventSourceEntity<'meetup'>, MeetupRawEventJob>
{
  #logger: Logger;

  constructor(logger: Logger) {
    this.#logger = logger.clone(MeetupGroupScrapper.name);
  }

  async scrapEventSource(
    _: EventSourceEntity<'meetup'>,
  ): Promise<Array<MeetupRawEventJob['content']>> {
    throw new Error(`Not implemented!`);
  }

  createRawEventJob(
    _: EventSourceEntity<'meetup'>,
    __: MeetupRawEventJob['content'],
  ): MeetupRawEventJob {
    throw new Error(`Not implemented!`);
  }

  getScrappedMessageId(_: MeetupRawEventJob['content']): string {
    throw new Error(`Not implemented!`);
  }
}
