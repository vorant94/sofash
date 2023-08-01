import { type DeepPartial, type Repository } from 'typeorm';
import { type EventSourceEntity } from './event-source.entity.js';

export class EventSourceDataSource {
  readonly #repository: Repository<EventSourceEntity>;

  constructor(repository: Repository<EventSourceEntity>) {
    this.#repository = repository;
  }

  async create(
    create: DeepPartial<EventSourceEntity>,
  ): Promise<EventSourceEntity> {
    return await this.#repository.save(this.#repository.create(create));
  }

  async findAll(): Promise<EventSourceEntity[]> {
    return await this.#repository.find();
  }

  async getByUri(uri: string): Promise<EventSourceEntity> {
    return await this.#repository.findOneOrFail({ where: { uri } });
  }

  async updateLatestScrappedMessageId(
    id: string,
    latestScrappedMessageId: string | null,
  ): Promise<void> {
    await this.#repository.update({ id }, { latestScrappedMessageId });
  }
}
