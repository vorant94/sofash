import { NestedStack, RemovalPolicy } from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import { SubnetType, type Vpc } from 'aws-cdk-lib/aws-ec2';
import { type Secret } from 'aws-cdk-lib/aws-secretsmanager';
import {
  AuroraPostgresEngineVersion,
  ClusterInstance,
  Credentials,
  DatabaseCluster,
  DatabaseClusterEngine,
} from 'aws-cdk-lib/aws-rds';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export class DbStack extends NestedStack {
  readonly databaseCluster: DatabaseCluster;

  constructor(scope: Construct, vpc: Vpc, credentialsSecret: Secret) {
    super(scope, 'sofash-db');

    this.databaseCluster = new DatabaseCluster(this, 'sofash-db-cluster', {
      vpc,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_15_3,
      }),
      writer: ClusterInstance.serverlessV2('writer'),
      readers: [
        ClusterInstance.serverlessV2('reader', { scaleWithWriter: true }),
      ],
      cloudwatchLogsRetention: RetentionDays.ONE_WEEK,
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 1,
      defaultDatabaseName: 'sofash',
      credentials: Credentials.fromSecret(credentialsSecret),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.databaseCluster.connections.allowDefaultPortFromAnyIpv4();
  }
}
