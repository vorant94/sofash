import { type Env } from '../core/env.js';

export function onlyInDev(env: Env): void {
  if (env.NODE_ENV !== 'development') {
    throw new Error(
      `This command is meant to be used only in development environment`,
    );
  }
}
