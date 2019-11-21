import cdk = require('@aws-cdk/core');
import { Bucket, HttpMethods, BlockPublicAccess } from '@aws-cdk/aws-s3';
import { RemovalPolicy } from '@aws-cdk/core';

export class S3Stack extends cdk.Stack {
    readonly bucket: Bucket;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new Bucket(this, 'bucket', {
            bucketName: 'basic-app',
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            cors: [
                {
                    allowedOrigins: ['*'],
                    allowedMethods: [HttpMethods.GET]
                }
            ],
            removalPolicy: RemovalPolicy.DESTROY
        });

        this.bucket = bucket;
    }
}
