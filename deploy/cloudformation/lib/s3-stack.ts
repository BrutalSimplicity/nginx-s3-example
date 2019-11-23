import cdk = require('@aws-cdk/core');
import { Bucket, HttpMethods, BlockPublicAccess } from '@aws-cdk/aws-s3';
import { RemovalPolicy } from '@aws-cdk/core';

export interface S3StackProps {
    stack?: cdk.StackProps;
    bucketId: string;
}

export class S3Stack extends cdk.Stack {
    readonly bucket: Bucket;

    constructor(scope: cdk.Construct, id: string, props: S3StackProps) {
        super(scope, id, props.stack);

        const bucket = new Bucket(this, 'bucket', {
            bucketName: props.bucketId,
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
