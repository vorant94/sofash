import { Logger } from 'logger';
import { type Env } from './env.js';

export function createLogger(env: Env): Logger {
  return new Logger({ console: true }, env.LOG_LEVEL).clone('Main');
}
