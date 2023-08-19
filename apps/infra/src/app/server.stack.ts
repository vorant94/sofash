import { NestedStack } from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { SubnetType, type Vpc } from 'aws-cdk-lib/aws-ec2';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';

export class ServerStack extends NestedStack {
  readonly restApi: RestApi;

  constructor(scope: Construct, vpc: Vpc) {
    super(scope, ServerStack.name);

    const handler = new Function(this, Function.name, {
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      code: Code.fromAsset('./path/to/the/built/server/code'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_18_X,
    });

    const integration = new LambdaIntegration(handler);

    // TODO remove stage name from generated URL
    //  (it is optional only with a custom domain)
    this.restApi = new RestApi(this, RestApi.name);

    // TODO make it proxy all requests to lambda instead of listing all of them
    //  (at first try there was some internal server errors, that I was too lazy
    //  to deal with them at the moment)
    this.restApi.root.addMethod('GET', integration);
  }
}

//
// example of wrapping express server to run it in AWS Lambda
//
// import express from 'express';
// import sourceMapSupport from 'source-map-support';
// import serverlessExpress from '@vendia/serverless-express';
//
// sourceMapSupport.install();
//
// const app = express();
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
//
// let instance;
// export function handler(event, context) {
//   if (instance != null) {
//     return instance(event, context);
//   }
//
//   return async (event, context) => {
//     // setup database connection and other async stuff here. it probably
//     // should be a function, that locally is run as main script
//     // and setups express listener, but in prod returns the app instead
//     instance = serverlessExpress({ app });
//     return instance(event, context);
//   };
// }
