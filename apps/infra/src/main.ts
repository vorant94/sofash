import { install } from 'source-map-support';
import { App } from 'aws-cdk-lib';
import { SofashStack } from './app/sofash.stack.js';

install();

const app = new App();
new SofashStack(app);
