import { type Command } from 'commander';
import { type Client, configure, createClient } from 'tdl';
import { type Env } from './env.js';

// TODO dig into why telegram#on error is not working
// TODO create separate dev telegram account for tdlib client
export function createTelegram(program: Command, env: Env): Client {
  configure({
    verbosityLevel: 1,
  });

  const client = createClient({
    apiId: env.TG_CLIENT_API_ID,
    apiHash: env.TG_CLIENT_API_HASH,
  });

  program.hook('postAction', async () => {
    await client.close();
  });

  return client;
}
