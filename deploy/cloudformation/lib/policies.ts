import cdk = require('@aws-cdk/core');
import { Bucket } from '@aws-cdk/aws-s3';
import { GatewayVpcEndpoint } from '@aws-cdk/aws-ec2';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';

export interface PolicyStackProps {
    stack?: cdk.StackProps;
    vpcEndPoint: GatewayVpcEndpoint;
    bucket: Bucket;
}

export function applyPolicies(props: PolicyStackProps) {
    const vpcePolicy = new PolicyStatement({
        effect: Effect.ALLOW
    });

    vpcePolicy.addAllResources();
    vpcePolicy.addAnyPrincipal();
    vpcePolicy.addActions('s3:GetObject');

    props.vpcEndPoint.addToPolicy(vpcePolicy);

    const s3Policy = new PolicyStatement({
        effect: Effect.ALLOW
    });
    const resource = props.bucket.bucketArn + '/*';

    s3Policy.addResources(resource);
    s3Policy.addAnyPrincipal();
    s3Policy.addActions('s3:GetObject');
    s3Policy.addCondition('StringEquals',
        { 'aws:sourceVpce': props.vpcEndPoint.vpcEndpointId });

    props.bucket.addToResourcePolicy(s3Policy);
}