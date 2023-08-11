import sourceMapSupport from 'source-map-support';
import { App } from 'aws-cdk-lib';
import { SofashStack } from './sofash.stack.js';

sourceMapSupport.install();

const app = new App();
const _sofash = new SofashStack(app, 'SofashStack', {});
