import { Command } from 'commander';
import { createCreateCommand } from './create.command.js';
import { createUpdateLatestScrappedMessageIdCommand } from './update-latest-scrapped-message-id.command.js';
import { type Db } from 'db';

export function createEventSourceCommand(db: Db): Command {
  return new Command('event-source')
    .addCommand(createCreateCommand(db))
    .addCommand(createUpdateLatestScrappedMessageIdCommand(db));
}
