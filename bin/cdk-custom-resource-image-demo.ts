#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkCustomResourceImageDemoStack, ECRPublic } from '../lib/cdk-custom-resource-image-demo-stack';

const app = new cdk.App();
new CdkCustomResourceImageDemoStack(app, 'CdkCustomResourceImageDemoStack', {
  env: { region: 'us-east-1', account: process.env.CDK_DEFAULT_ACCOUNT },
});

new ECRPublic(app, 'EcrPublicStack', {
  env: { region: 'us-east-1', account: process.env.CDK_DEFAULT_ACCOUNT },
});
