#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { VpcStack } from '../lib/vpc-stack';
import { S3Stack } from '../lib/s3-stack';
import { applyPolicies } from '../lib/policies';

const account = process.env['CDK_ACCOUNT'];
const region = process.env['CDK_REGION'];

const app = new cdk.App();

const props = {
    env: { account, region }
} as cdk.StackProps;

const s3 = new S3Stack(app, 'example-s3-stack', props);

const vpc = new VpcStack(app, 'example-vpc-stack', props);

applyPolicies({
    stack: props,
    vpcEndPoint: vpc.vpcEndpoint,
    bucket: s3.bucket
});