#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { VpcStack } from '../lib/vpc-stack';
import { S3Stack } from '../lib/s3-stack';
import { applyPolicies } from '../lib/policies';
import { FargateStack } from '../lib/fargate-stack';
import { repositoryExists, EcrConfig, EcrStack } from '../lib/ecr-stack';

const stackId = process.env['STACK_ID'] || '' as string;
const account = process.env['CDK_ACCOUNT'] || '' as string;
const region = process.env['CDK_REGION'] || '' as string;
const certificateArn = process.env['CERTIFICATE_ARN'] || '' as string;
const vpcId = process.env['VPC_ID'] || '' as string;
const zoneDomain = process.env['ZONE_DOMAIN_NAME'] || '' as string;
const cpu = process.env['CPU'] || '512' as string;
const memory = process.env['MEMORY'] || '1024' as string;
const numInstances = process.env['NUM_INSTANCES'] || '2' as string;
const bucketId = process.env['BUCKET_ID'] || '' as string;
const domainName = process.env['DOMAIN_NAME'] || '' as string;
const clusterName = process.env['CLUSTER_NAME'] || '' as string;
const serviceName = process.env['SERVICE_NAME'] || '' as string;
const imageName = process.env['IMAGE_NAME'] || '' as string;
const accessKey = process.env['AWS_ACCESS_KEY'] || '' as string;
const secretKey = process.env['AWS_SECRET_ACCESS_KEY'] || '' as string;
const token = process.env['AWS_SESSION_TOKEN'] || '' as string;

const required = {
    stackId,
    account,
    region,
    certificateArn,
    zoneDomain
} as any;

const display = {
    stackId,
    account,
    region,
    certificateArn,
    vpcId,
    zoneDomain,
    cpu,
    memory,
    numInstances,
    bucketId,
    domainName,
    clusterName,
    serviceName,
    imageName
} as any;

for (const key in required) {
    if (required.hasOwnProperty(key)) {
        if (!required[key]) {
            console.error('Missing required field: ' + key);
            process.exit(1);
        }
    }
}

for (const key in display) {
    if (display.hasOwnProperty(key)) {
        console.log(key + ': ' + display[key]);
    }
}

const app = new cdk.App();

const props = {
    env: { account, region }
} as cdk.StackProps;

const ecrConfig = {
    accessKey,
    secret: secretKey,
    accountId: account,
    region,
    token
} as EcrConfig;

async function createStacks(): Promise<void> {
    const ecrStack = new EcrStack(app, `${stackId}-ecr`, {
        stack: props,
        imageName,
        shouldCreate: !(await repositoryExists(imageName, ecrConfig))
    });

    const s3Stack = new S3Stack(app, `${stackId}-s3`, {
        stack: props,
        bucketId
    });

    const vpcStack = new VpcStack(app, `${stackId}-vpc`, {
        stack: props,
        vpcId
    });

    applyPolicies({
        stack: props,
        vpcEndPoint: vpcStack.vpcEndpoint,
        bucket: s3Stack.bucket
    });

    new FargateStack(app, `${stackId}-fargate`, {
        stack: props,
        vpc: vpcStack.vpc,
        certificateArn,
        clusterName,
        cpu: parseInt(cpu, 10),
        memory: parseInt(memory, 10),
        domainName,
        zoneDomainName: zoneDomain,
        numInstances: parseInt(numInstances, 10),
        repository: ecrStack.repository,
        serviceName
    });
}

createStacks();
