import cdk = require('@aws-cdk/core');
import { IVpc, Vpc, SubnetType, GatewayVpcEndpointAwsService, GatewayVpcEndpoint } from '@aws-cdk/aws-ec2';

export interface VpcStackProps {
    stack?: cdk.StackProps;
    vpcId?: string;
}

export class VpcStack extends cdk.Stack {
    readonly vpc: IVpc;
    readonly vpcEndpoint: GatewayVpcEndpoint;

    constructor(scope: cdk.Construct, id: string, props: VpcStackProps) {
        super(scope, id, props.stack);

        const vpc = props.vpcId ?
            Vpc.fromLookup(this, 'vpc', {
                vpcId: props.vpcId
            })
                :
            new Vpc(this, 'vpc', {
                maxAzs: 3
            });

        const vpcEndpoint = new GatewayVpcEndpoint(this, 'vpc-endpoint', {
            service: GatewayVpcEndpointAwsService.S3,
            vpc,
            subnets: [{
                subnetType: SubnetType.PRIVATE
            }]
        });

        this.vpc = vpc;
        this.vpcEndpoint = vpcEndpoint;
    }
}
