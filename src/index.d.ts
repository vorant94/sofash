import { type Context } from './shared/context.js';

declare global {
  namespace Express {
    interface Locals extends Context {}
  }
}
