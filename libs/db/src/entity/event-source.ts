import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const EVENT_SOURCE_TYPES = ['telegram'] as const;
export type EventSourceType = (typeof EVENT_SOURCE_TYPES)[number];

@Entity()
export class EventSource {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  uri!: string;

  @Column({ type: 'enum', enum: EVENT_SOURCE_TYPES })
  type!: EventSourceType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
