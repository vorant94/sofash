import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/base.entity.js';

export const EVENT_SOURCE_TYPES = ['telegram', 'meetup'] as const;
export type EventSourceType = (typeof EVENT_SOURCE_TYPES)[number];

@Entity()
export class EventSource<
  TType extends EventSourceType = EventSourceType,
> extends BaseEntity {
  @Column({ unique: true })
  uri!: string;

  @Column({ nullable: true, type: String })
  latestScrappedMessageId?: string | null;

  @Column({ type: 'enum', enum: EVENT_SOURCE_TYPES })
  type!: TType;
}
