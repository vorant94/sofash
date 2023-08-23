import { NestedStack } from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { SubnetType, type Vpc } from 'aws-cdk-lib/aws-ec2';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import path from 'path';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export class ServerStack extends NestedStack {
  readonly restApi: RestApi;

  constructor(scope: Construct, vpc: Vpc) {
    super(scope, ServerStack.name);

    const handler = new Function(this, Function.name, {
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      code: Code.fromDockerBuild(path.resolve(`../../`), {
        imagePath: '/usr/local/sofash',
      }),
      handler: 'apps/server/dist/lambda.handler',
      runtime: Runtime.NODEJS_18_X,
      logRetention: RetentionDays.ONE_WEEK,
      environment: {
        NODE_ENV: 'PROD',
        DB_HOST: 'xxx',
        DB_USERNAME: 'xxx',
        DB_PASSWORD: 'xxx',
        MQ_HOST: 'xxx',
        TG_BOT_TOKEN: 'xxx',
        TG_BOT_WEBHOOK_URL: 'xxx',
      },
    });

    const integration = new LambdaIntegration(handler);

    // TODO remove stage name from generated URL
    //  (it is optional only with a custom domain)
    this.restApi = new RestApi(this, RestApi.name);

    this.restApi.root.addProxy({
      anyMethod: true,
      defaultIntegration: integration,
    });
  }
}
