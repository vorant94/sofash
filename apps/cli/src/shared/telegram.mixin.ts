import { type Command } from '@oclif/core';
import { type AbstractConstructor } from './constructor.js';
import { type Client, configure, createClient } from 'tdl';
import { type HasEnv } from './env.mixin.js';

export type CanHaveTelegram = AbstractConstructor<HasEnv>;

export interface HasTelegram extends Command {
  usingTelegram: <T>(callback: (telegram: Client) => Promise<T>) => Promise<T>;
}

export function telegramMixin<T extends CanHaveTelegram>(
  base: T,
): AbstractConstructor<HasTelegram> & T {
  abstract class BaseWithMixin extends base {
    // TODO find why client.on('error', console.error) doesnt work, so it can be
    //  refactored with handling connection in "init" and "finally" methods
    async usingTelegram<T>(
      callback: (telegram: Client) => Promise<T>,
    ): Promise<T> {
      const client = createClient({
        apiId: this.env.TG_CLIENT_API_ID,
        apiHash: this.env.TG_CLIENT_API_HASH,
      });

      try {
        return await callback(client);
      } catch (error) {
        this.error(`[Telegram Error]: ${JSON.stringify(error, null, 2)}`);
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
