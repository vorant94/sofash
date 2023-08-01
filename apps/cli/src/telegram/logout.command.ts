import { type Client } from 'tdl';
import { Command } from 'commander';
import { CONTAINER, TELEGRAM } from '../shared/container.js';

export const LOGOUT_COMMAND = new Command('logout').action(async () => {
  const telegram = CONTAINER.get<Client>(TELEGRAM);

  await telegram.invoke({
    _: 'logOut',
  });
});
