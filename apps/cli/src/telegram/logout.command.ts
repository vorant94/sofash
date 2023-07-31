import { type Client } from 'tdl';
import { Command } from 'commander';

export function createLogoutCommand(telegram: Client): Command {
  return new Command('logout').action(async () => {
    await telegram.invoke({
      _: 'logOut',
    });
  });
}
