import { type Command } from '@oclif/core';
import { type AbstractConstructor } from './constructor.js';
import { type HasEnv } from './env.mixin.js';
import { Mq } from 'mq';

export type CanHaveMq = AbstractConstructor<HasEnv>;

export interface HasMq extends Command {
  mq: Mq;
}

export function mqMixin<T extends CanHaveMq>(
  base: T,
): AbstractConstructor<HasMq> & T {
  abstract class BaseWithMixin extends base {
    mq!: Mq;

    async finally(error: Error | undefined): Promise<any> {
      await this.mq.quit();

      return await super.finally(error);
    }

    protected async init(): Promise<any> {
      const superRes = await super.init();

      this.mq = new Mq({
        host: this.env.MQ_HOST,
        port: this.env.MQ_PORT,
      });

      return superRes;
    }
  }

  return BaseWithMixin;
}
