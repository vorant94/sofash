import { type Db } from 'db';
import { Command } from 'commander';
import { CONTAINER, DB } from '../shared/container.js';

export const UPDATE_LATEST_SCRAPPED_MESSAGE_ID_COMMAND = new Command(
  'update-latest-scrapped-message-id',
)
  .requiredOption(`--uri <string>`)
  .option(`--latest-scrapped-message-id <string>`)
  .action(async ({ uri, latestScrappedMessageId }: Options) => {
    const db = CONTAINER.get<Db>(DB);

    const { id } = await db.eventSources.getByUri(uri);

    await db.eventSources.updateLatestScrappedMessageId(
      id,
      latestScrappedMessageId ?? null,
    );
  });

interface Options {
  uri: string;
  latestScrappedMessageId?: string;
}
