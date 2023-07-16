import { type Command } from '@oclif/core';
import { type AbstractConstructor } from './constructor.js';
import { type Client, configure, createClient } from 'tdl';
import { type HasEnv } from './env.mixin.js';

export type CanHaveTelegram = AbstractConstructor<HasEnv>;

export interface HasTelegram extends Command {
  withTelegram: <T>(callback: (telegram: Client) => Promise<T>) => Promise<T>;
}

export function telegramMixin<T extends CanHaveTelegram>(
  base: T,
): AbstractConstructor<HasTelegram> & T {
  abstract class BaseWithMixin extends base {
    // creating it each time in order to keep connections open as little as possible
    async withTelegram<T>(
      callback: (telegram: Client) => Promise<T>,
    ): Promise<T> {
      const client = createClient({
        apiId: this.env.TG_CLIENT_API_ID,
        apiHash: this.env.TG_CLIENT_API_HASH,
      });

      try {
        return await callback(client);
      } catch (error) {
        // need it because this.telegram.on('error', console.error) doesn't work for some reason
        this.error(`[Telegram Error]: ${JSON.stringify(error, null, 2)}`);
        throw error;
      } finally {
        await client.close();
      }
    }

    protected async init(): Promise<any> {
      const superRes = await super.init();

      configure({
        verbosityLevel: 1,
      });

      return superRes;
    }
  }

  return BaseWithMixin;
}
