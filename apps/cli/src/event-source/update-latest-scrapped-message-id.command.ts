import { type Db } from 'db';
import { Command } from 'commander';

export function createUpdateLatestScrappedMessageIdCommand(db: Db): Command {
  return new Command('update-latest-scrapped-message-id')
    .requiredOption(`--uri <string>`)
    .option(`--latest-scrapped-message-id <string>`)
    .action(async ({ uri, latestScrappedMessageId }: Options) => {
      const { id } = await db.eventSources.getByUri(uri);

      await db.eventSources.updateLatestScrappedMessageId(
        id,
        latestScrappedMessageId ?? null,
      );
    });
}

interface Options {
  uri: string;
  latestScrappedMessageId?: string;
}
