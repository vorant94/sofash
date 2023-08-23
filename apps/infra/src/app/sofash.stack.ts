import { Stack } from 'aws-cdk-lib';
import { type Construct } from 'constructs';
import { NetworkStack } from './network.stack.js';
import { DbStack } from './db.stack.js';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { ServerStack } from './server.stack.js';

export class SofashStack extends Stack {
  constructor(scope: Construct) {
    super(scope, SofashStack.name);

    const credentialsSecret = new Secret(this, Secret.name, {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'sofash' }),
        generateStringKey: 'password',
        passwordLength: 16,
        excludePunctuation: true,
      },
    });

    const network = new NetworkStack(this);

    new DbStack(this, network.vpc, credentialsSecret);

    new ServerStack(this, network.vpc);
  }
}
