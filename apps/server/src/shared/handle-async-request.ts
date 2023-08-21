import { type RequestHandler } from 'express';

export type AsyncRequestHandler = (
  ...args: Parameters<RequestHandler>
) => Promise<void>;

export function handleAsyncRequest(
  handler: AsyncRequestHandler,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(({ message }) =>
      res.status(400).send({
        message,
      }),
    );
  };
}
