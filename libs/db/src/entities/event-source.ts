import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/base.entity.js';

export const EVENT_SOURCE_TYPES = ['telegram', 'meetup'] as const;
export type EventSourceType = (typeof EVENT_SOURCE_TYPES)[number];

@Entity()
export class EventSource extends BaseEntity {
  @Column({ unique: true })
  uri!: string;

  @Column({ nullable: true })
  latestScrappedMessageId?: string;

  @Column({ type: 'enum', enum: EVENT_SOURCE_TYPES })
  type!: EventSourceType;
}

export interface TelegramEventSource extends EventSource {
  type: 'telegram';
}

export interface MeetupEventSource extends EventSource {
  type: 'meetup';
}

export function isTelegramEventSource(
  eventSource: EventSource,
): eventSource is TelegramEventSource {
  return eventSource.type === 'telegram';
}

export function isMeetupEventSource(
  eventSource: EventSource,
): eventSource is MeetupEventSource {
  return eventSource.type === 'meetup';
}
