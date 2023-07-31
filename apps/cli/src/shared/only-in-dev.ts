import { type Env } from '../core/env.js';

export function onlyInDev(env: Env): void {
  if (env.NODE_ENV !== 'DEV') {
    throw new Error(`This command is meant to be used only in DEV environment`);
  }
}
