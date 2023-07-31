import { type EventSource } from 'db';
import { type RawEvent } from 'mq';

export interface Scrapper<
  TEventSource extends EventSource = EventSource,
  TRawEvent extends RawEvent = RawEvent,
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
