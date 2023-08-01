import { type Client } from 'tdl';
import { Command } from 'commander';
import { CONTAINER, TELEGRAM } from '../shared/container.js';

export const LOGIN_COMMAND = new Command('login').action(async () => {
  const telegram = CONTAINER.get<Client>(TELEGRAM);

  await telegram.login();
});
