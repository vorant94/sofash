import { Command, Flags } from '@oclif/core';
import { envMixin } from '../../shared/env.mixin.js';
import { dbMixin } from '../../shared/db.minin.js';
import { EVENT_SOURCE_TYPES, EventSource, type EventSourceType } from 'db';

export default class Add extends dbMixin(envMixin(Command)) {
  static flags = {
    uri: Flags.string({ required: true }),
    type: Flags.string({
      default: 'telegram',
      options: [...EVENT_SOURCE_TYPES],
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Add);

    const eventSource = new EventSource();
    eventSource.uri = flags.uri;
    eventSource.type = flags.type as EventSourceType;

    const eventSourceRepository = this.db.getRepository(EventSource);
    await eventSourceRepository.save(eventSource);
  }
}
