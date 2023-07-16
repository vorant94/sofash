import { type Command } from '@oclif/core';
import { type AbstractConstructor } from './constructor.js';
import { type Client, configure, createClient } from 'tdl';
import { type HasEnv } from './env.mixin.js';

export type CanHaveTelegram = AbstractConstructor<HasEnv>;

export interface HasTelegram extends Command {
  telegram: Client;
}

export function telegramMixin<T extends CanHaveTelegram>(
  base: T,
): AbstractConstructor<HasTelegram> & T {
  abstract class BaseWithMixin extends base {
    telegram!: Client;

    // need it because this.telegram.on('error', console.error) doesn't work for some reason
    protected async catch(error: Error): Promise<any> {
      this.log(`[Telegram Error]: ${JSON.stringify(error, null, 2)}`);
      return await super.catch(error);
    }

    protected async finally(error: Error | undefined): Promise<any> {
      await this.telegram.close();
      return await super.finally(error);
    }

    protected async init(): Promise<any> {
      const superRes = await super.init();

      configure({
        verbosityLevel: 1,
      });

      this.telegram = createClient({
        apiId: this.env.TG_CLIENT_API_ID,
        apiHash: this.env.TG_CLIENT_API_HASH,
      });

      return superRes;
    }
  }

  return BaseWithMixin;
}
