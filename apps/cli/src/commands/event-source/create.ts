import { Command, Flags } from '@oclif/core';
import { envMixin } from '../../shared/env.mixin.js';
import { dbMixin } from '../../shared/db.mixin.js';
import { EVENT_SOURCE_TYPES, type EventSourceType } from 'db';

export default class Create extends dbMixin(envMixin(Command)) {
  static flags = {
    uri: Flags.string({ required: true }),
    type: Flags.custom<EventSourceType>({
      options: [...EVENT_SOURCE_TYPES],
    })({
      default: 'telegram',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Create);

    await this.db.eventSources.create({
      uri: flags.uri,
      type: flags.type,
    });
  }
}
