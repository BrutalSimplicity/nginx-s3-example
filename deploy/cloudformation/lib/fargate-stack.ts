import cdk = require('@aws-cdk/core');
import { IVpc } from '@aws-cdk/aws-ec2';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';
import { EcrImage, Cluster } from '@aws-cdk/aws-ecs';
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import { Repository, IRepository } from '@aws-cdk/aws-ecr';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';

export interface FargateStackProps {
    stack?: cdk.StackProps;
    vpc: IVpc;
    repository: IRepository;
    clusterName: string;
    serviceName: string;
    certificateArn: string;
    zoneDomainName: string;
    domainName: string;
    cpu: number;
    memory: number;
    numInstances: number;
    bucketId: string;
}

export class FargateStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: FargateStackProps) {
        super(scope, id, props.stack);

        const cluster = new Cluster(this, 'cluster', {
            clusterName: props.clusterName,
            vpc: props.vpc
        });

        const certificate = Certificate.fromCertificateArn(this, 'certificate', props.certificateArn);

        const hostedZone = HostedZone.fromLookup(this, 'hosted-zone', {
            domainName: props.zoneDomainName
          });

        const image = EcrImage.fromEcrRepository(props.repository, 'latest');

        const bucketDomain = props.bucketId + '.s3.amazonaws.com';

        const fargate = new ApplicationLoadBalancedFargateService(this, 'fargate', {
            cluster,
            certificate,
            domainZone: hostedZone,
            domainName: props.domainName,
            protocol: ApplicationProtocol.HTTPS,
            cpu: 512,
            memoryLimitMiB: 1024,
            desiredCount: 4,
            serviceName: props.serviceName,
            taskImageOptions: {
                image,
                containerName: 'nginx',
                containerPort: 80,
                environment: {
                    'BUCKET_DOMAIN': bucketDomain
                }
            }
        });

        fargate.targetGroup.configureHealthCheck({
            path: '/health'
        });
    }
}