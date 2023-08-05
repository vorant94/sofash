import { type DeepPartial, type Repository } from 'typeorm';
import { type EventEntity } from './event.entity.js';

export class EventDataSource {
  readonly #repository: Repository<EventEntity>;

  constructor(repository: Repository<EventEntity>) {
    this.#repository = repository;
  }

  async create(create: DeepPartial<EventEntity>): Promise<EventEntity> {
    return await this.#repository.save(this.#repository.create(create));
  }
}
