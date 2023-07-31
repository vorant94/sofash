import { Command, Option } from 'commander';
import { type Db, EVENT_SOURCE_TYPES, type EventSourceType } from 'db';

export function createCreateCommand(db: Db): Command {
  return new Command('create')
    .requiredOption(`--uri <string>`)
    .addOption(
      new Option(`--type <type>`)
        .choices(EVENT_SOURCE_TYPES)
        .default('telegram')
        .makeOptionMandatory(),
    )
    .action(async ({ uri, type }: Options) => {
      await db.eventSources.create({
        uri,
        type,
      });
    });
}

interface Options {
  uri: string;
  type: EventSourceType;
}
