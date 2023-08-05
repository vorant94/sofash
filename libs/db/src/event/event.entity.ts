import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity.js';
import { EventSourceEntity } from '../event-source/event-source.entity.js';
import { EVENT_LANGUAGES, EventLanguage } from '../shared/event-language.js';

@Entity({ name: 'event' })
export class EventEntity extends BaseEntity {
  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  startingAt!: Date;

  @Column()
  endingAt!: Date;

  @Column({ nullable: true })
  price?: number;

  // TODO add a custom transformer URL <=> string
  @Column()
  detailsUrl!: string;

  @Column()
  city!: string;

  @Column({ type: 'enum', enum: EVENT_LANGUAGES })
  language!: EventLanguage;

  @Column()
  sourceMessageId!: string;

  @Column()
  sourceId!: string;

  @ManyToOne(() => EventSourceEntity)
  source!: EventSourceEntity;
}
