import cdk = require('@aws-cdk/core');
import { IVpc, Vpc, SubnetType, GatewayVpcEndpointAwsService, GatewayVpcEndpoint } from '@aws-cdk/aws-ec2';

export class VpcStack extends cdk.Stack {
    readonly vpc: IVpc;
    readonly vpcEndpoint: GatewayVpcEndpoint;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = Vpc.fromLookup(this, 'vpc', {
            vpcId: 'vpc-03a7c6d0e48aa6073'
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
