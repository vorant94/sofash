import { type EventSource } from '../entities/event-source.js';
import { type DeepPartial, type Repository } from 'typeorm';

export class EventSources {
  constructor(private readonly repository: Repository<EventSource>) {}

  async create(create: DeepPartial<EventSource>): Promise<EventSource> {
    return await this.repository.save(this.repository.create(create));
  }
}
