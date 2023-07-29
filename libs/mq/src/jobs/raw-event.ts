import { type EventSource } from 'db';
import { type message } from 'tdlib-types';
import { type BaseModel } from '../shared/base.model.js';

export type RawEvent = TelegramRawEvent;

export interface TelegramRawEvent extends BaseModel {
  eventSource: EventSource<'telegram'>;
  content: EventSourceTypeToRawEventContent['telegram'];
}

// TODO bind it somehow to event source type enum
interface EventSourceTypeToRawEventContent {
  telegram: message;
}
