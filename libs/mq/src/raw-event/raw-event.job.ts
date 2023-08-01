import { type message } from 'tdlib-types';
import { type BaseJob } from '../shared/base.job.js';
import { type EventSourceEntity } from 'db';

export type RawEventJob = TelegramRawEventJob;

export interface TelegramRawEventJob extends BaseJob {
  eventSource: EventSourceEntity<'telegram'>;
  content: EventSourceTypeToRawEventContent['telegram'];
}

// TODO bind it somehow to event source type enum
interface EventSourceTypeToRawEventContent {
  telegram: message;
}
