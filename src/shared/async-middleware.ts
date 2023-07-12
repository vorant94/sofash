import { type RequestHandler } from 'express';

export type AsyncRequestHandler = (
  ...args: Parameters<RequestHandler>
) => Promise<void>;

export function asyncMiddleware(handler: AsyncRequestHandler): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
