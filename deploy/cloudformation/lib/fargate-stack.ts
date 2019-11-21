import cdk = require('@aws-cdk/core');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import { IVpc } from '@aws-cdk/aws-ec2';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';
import { Protocol, EcrImage } from '@aws-cdk/aws-ecs';
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import { Repository } from '@aws-cdk/aws-ecr';

export interface FargateStackProps {
    stack?: cdk.StackProps;
    vpc: IVpc;
    certificateArn: string;
}

export class FargateStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: FargateStackProps) {
        super(scope, id, props.stack);

        const cluster = new ecs.Cluster(this, 'cluster', {
            vpc: props.vpc
        });

        const certificate = Certificate.fromCertificateArn(this, 'certificate', props.certificateArn);

        const hostedZone = HostedZone.fromLookup(this, 'hosted-zone', {
            domainName: 'opssuitego.dev2.swacorp.com'
          });

        const repo = Repository.fromRepositoryName(this, 'repository', '233911428360.dkr.ecr.us-east-1.amazonaws.com/basic-nginx-proxy');
        const image = EcrImage.fromEcrRepository(repo, 'latest');

        const fargate = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'fargate', {
            cluster,
            certificate,
            domainZone: hostedZone,
            domainName: 'basic-app.opssuitego.dev2.swacorp.com',
            protocol: ApplicationProtocol.HTTPS,
            cpu: 512,
            memoryLimitMiB: 1024,
            desiredCount: 4,
            serviceName: 'nginx-proxy-service',
            taskImageOptions: {
                image,
                containerName: 'nginx:alpine',
                containerPort: 80
            }
        });
    }
}