import { NestedStack } from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

export class NetworkStack extends NestedStack {
  readonly vpc: Vpc;

  // TODO find a awy to set retention for the logs related to this stack
  constructor(scope: Construct) {
    super(scope, NetworkStack.name);

    this.vpc = new Vpc(this, Vpc.name, {
      natGateways: 0,
    });
  }
}
