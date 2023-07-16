import { type Command } from '@oclif/core';
import { type AbstractConstructor } from './constructor.js';
import { type HasEnv } from './env.mixin.js';

export type CanHaveOnlyInDev = AbstractConstructor<HasEnv>;

export type HasOnlyInDev = Command;

export function onlyInDevMixin<T extends CanHaveOnlyInDev>(
  base: T,
): AbstractConstructor<HasOnlyInDev> & T {
  abstract class BaseWithMixin extends base {
    protected async init(): Promise<any> {
      const superRes = await super.init();

      if (this.env.NODE_ENV !== 'DEV') {
        throw new Error(
          `This command is meant to be used only in DEV environment`,
        );
      }

      return superRes;
    }
  }

  return BaseWithMixin;
}
