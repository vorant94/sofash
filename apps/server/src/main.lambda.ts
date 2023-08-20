// import { main } from './main.js';
// import serverless from 'serverless-http';
// import { type APIGatewayEvent, type Handler } from 'aws-lambda';
// import sourceMapSupport from 'source-map-support';
//
// sourceMapSupport.install();
//
// let instance: Handler<APIGatewayEvent>;
// export const handler: Handler<APIGatewayEvent> = async (
//   ...args: Parameters<Handler<APIGatewayEvent>>
// ): Promise<any> => {
//   if (instance != null) {
//     return instance(...args);
//   }
//
//   return async (
//     ...args: Parameters<Handler<APIGatewayEvent>>
//   ): Promise<any> => {
//     const server = await main();
//     instance = serverless(server);
//     return instance(...args);
//   };
// };
