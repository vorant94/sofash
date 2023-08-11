import { RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
  ObjectOwnership,
} from 'aws-cdk-lib/aws-s3';
import { type Construct } from 'constructs';

export class SofashStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const _testBucket = new Bucket(this, `test-bucket`, {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      accessControl: BucketAccessControl.PRIVATE,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
      autoDeleteObjects: true,
    });
  }
}
