import { Command, Option } from 'commander';
import { type Db, EVENT_SOURCE_TYPES, type EventSourceType } from 'db';
import { CONTAINER, DB } from '../shared/container.js';

export const CREATE_COMMAND = new Command('create')
  .requiredOption(`--uri <string>`)
  .addOption(
    new Option(`--type <type>`)
      .choices(EVENT_SOURCE_TYPES)
      .default('telegram')
      .makeOptionMandatory(),
  )
  .action(async ({ uri, type }: Options) => {
    const db = CONTAINER.get<Db>(DB);

    await db.eventSources.create({
      uri,
      type,
    });
  });

interface Options {
  uri: string;
  type: EventSourceType;
}
