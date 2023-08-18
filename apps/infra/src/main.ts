import sourceMapSupport from 'source-map-support';
import { App } from 'aws-cdk-lib';
import { SofashStack } from './app/sofash.stack.js';

sourceMapSupport.install();

const app = new App();
new SofashStack(app);
