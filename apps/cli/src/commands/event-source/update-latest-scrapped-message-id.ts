import { Command, Flags } from '@oclif/core';
import { envMixin } from '../../shared/env.mixin.js';
import { dbMixin } from '../../shared/db.mixin.js';

export default class UpdateLatestScrappedMessageId extends dbMixin(
  envMixin(Command),
) {
  static flags = {
    uri: Flags.string({ required: true }),
    latestScrappedMessageId: Flags.string(),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(UpdateLatestScrappedMessageId);

    const { id } = await this.db.eventSources.getByUri(flags.uri);

    await this.db.eventSources.updateLatestScrappedMessageId(
      id,
      flags.latestScrappedMessageId ?? null,
    );
  }
}
