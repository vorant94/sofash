import { type RawEventJob } from 'mq';
import { type EventSourceEntity } from 'db';

export interface Scrapper<
  TEventSource extends EventSourceEntity = EventSourceEntity,
  TRawEvent extends RawEventJob = RawEventJob,
> {
  scrapEventSource: (
    eventSource: TEventSource,
  ) => Promise<Array<TRawEvent['content']>>;

  createRawEventJob: (
    eventSource: TEventSource,
    content: TRawEvent['content'],
  ) => TRawEvent;

  getScrappedMessageId: (content: TRawEvent['content']) => string;
}
