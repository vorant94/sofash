import {
  CfnOutput,
  CfnParameter,
  RemovalPolicy,
  SecretValue,
  Stack,
  type StackProps,
} from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
} from 'aws-cdk-lib/aws-rds';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

export class SofashStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dbRootUserPassword = new CfnParameter(this, 'db-root-user-password', {
      noEcho: true,
    });

    const vpc = new Vpc(this, 'vpc');

    const dbRootUserSecret = new Secret(this, 'db-root-user-secret', {
      secretObjectValue: {
        username: SecretValue.unsafePlainText('postgres'),
        password: SecretValue.cfnParameter(dbRootUserPassword),
      },
    });

    const db = new DatabaseInstance(this, 'db', {
      vpc,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_15_3,
      }),
      credentials: Credentials.fromSecret(dbRootUserSecret),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    db.connections.allowDefaultPortFromAnyIpv4();

    new CfnOutput(this, 'db-endpoint', {
      value: db.dbInstanceEndpointAddress,
    });
  }
}
