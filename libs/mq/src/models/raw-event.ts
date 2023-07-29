import { type EventSource } from 'db';
import { type message } from 'tdlib-types';
import { type BaseModel } from '../shared/base.model.js';

export type RawEvent = TelegramRawEvent;
export type RawEventContent = RawEvent['content'];

export interface TelegramRawEvent extends BaseModel {
  eventSource: EventSource<'telegram'>;
  content: message;
}
export type TelegramRawEventContent = TelegramRawEvent['content'];
