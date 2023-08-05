import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/base.entity.js';
import {
  EVENT_LANGUAGES,
  type EventLanguage,
} from '../shared/event-language.js';

export const EVENT_SOURCE_TYPES = ['telegram', 'meetup'] as const;
export type EventSourceType = (typeof EVENT_SOURCE_TYPES)[number];

@Entity({ name: 'event_source' })
export class EventSourceEntity<
  TType extends EventSourceType = EventSourceType,
> extends BaseEntity {
  @Column({ unique: true })
  uri!: string;

  @Column({ type: String, nullable: true })
  latestScrappedMessageId?: string | null;

  @Column({ type: 'enum', enum: EVENT_SOURCE_TYPES })
  type!: TType;

  @Column({ type: String, nullable: true })
  eventCity?: string | null;

  @Column({ type: 'enum', enum: EVENT_LANGUAGES, nullable: true })
  eventLanguage?: EventLanguage | null;
}
