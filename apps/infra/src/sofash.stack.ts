import { RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
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

    const vpc = new Vpc(this, 'sofash-vpc');

    const dbRootUserSecret = new Secret(this, 'sofash-db-root-user-secret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        passwordLength: 16,
        excludePunctuation: true,
      },
    });

    const db = new DatabaseInstance(this, 'sofash-db', {
      vpc,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_15_3,
      }),
      credentials: Credentials.fromSecret(dbRootUserSecret),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    db.connections.allowDefaultPortFromAnyIpv4();
  }
}
