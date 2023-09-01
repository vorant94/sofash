import { type RawEventJob } from 'mq';
import { type EventEntity } from 'db';
import { type DeepPartial } from 'typeorm';

export interface Parser<TRawEvent extends RawEventJob = RawEventJob> {
  parseRawEventJob: (rawEvent: TRawEvent) => Promise<DeepPartial<EventEntity>>;
}
