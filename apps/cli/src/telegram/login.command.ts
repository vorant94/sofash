import { type Client } from 'tdl';
import { Command } from 'commander';

export function createLoginCommand(telegram: Client): Command {
  return new Command('login').action(async () => {
    await telegram.login();
  });
}
