import { main } from './main.js';
import { configure } from '@vendia/serverless-express';
import { type APIGatewayEvent, type Handler } from 'aws-lambda';
import { install } from 'source-map-support';
import { setupGracefulShutdown } from './core/setup-graceful-shutdown.js';

install();

let instance: Handler<APIGatewayEvent>;
export const handler: Handler<APIGatewayEvent> = async (
  ...args: Parameters<Handler<APIGatewayEvent>>
): Promise<any> => {
  if (instance != null) {
    return await instance(...args);
  }

  const app = await main();
  instance = configure({ app });
  setupGracefulShutdown();

  return await instance(...args);
};
