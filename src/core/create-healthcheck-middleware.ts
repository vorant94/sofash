import { type RequestHandler } from 'express';

export function createHealthcheckMiddleware(): RequestHandler {
  return (_, res) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    };

    try {
      res.send(healthcheck);
    } catch (error) {
      healthcheck.message = JSON.stringify(error);
      res.status(503).send();
    }
  };
}
