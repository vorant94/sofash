import { NestedStack, RemovalPolicy } from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  SubnetType,
  type Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { type Secret } from 'aws-cdk-lib/aws-secretsmanager';
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
  StorageType,
} from 'aws-cdk-lib/aws-rds';

export class DbStack extends NestedStack {
  readonly databaseInstance: DatabaseInstance;

  constructor(scope: Construct, vpc: Vpc, credentialsSecret: Secret) {
    super(scope, 'sofash-db');

    this.databaseInstance = new DatabaseInstance(this, 'sofash-db', {
      vpc,
      // TODO make it SubnetType.PRIVATE_ISOLATED and setup VPN connection in NetworkStack
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_15_3,
      }),
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      storageType: StorageType.GP2,
      allocatedStorage: 1,
      credentials: Credentials.fromSecret(credentialsSecret),
      databaseName: 'sofash',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.databaseInstance.connections.allowDefaultPortFromAnyIpv4();
  }
}
