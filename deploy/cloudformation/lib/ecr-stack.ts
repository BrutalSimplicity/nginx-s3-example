import cdk = require('@aws-cdk/core');
import sdk = require('aws-sdk');
import { Repository, IRepository } from '@aws-cdk/aws-ecr';
import { RemovalPolicy } from '@aws-cdk/core';
import { AWSError } from 'aws-sdk';

export interface EcrStackProps {
    stack?: cdk.StackProps;
    imageName: string;
    shouldCreate: boolean;
}

export class EcrStack extends cdk.Stack {
    readonly repository: IRepository;

    constructor(scope: cdk.Construct, id: string, props: EcrStackProps) {
        super(scope, id, props.stack);

        this.repository = props.shouldCreate ?
             new Repository(this, 'repository', {
                repositoryName: props.imageName,
                removalPolicy: RemovalPolicy.DESTROY
            })
                :
            Repository.fromRepositoryName(this, 'repository', props.imageName);
    }
}

export interface EcrConfig {
    secret: string;
    accessKey: string;
    token?: string;
    region: string;
    accountId: string;
}

export async function repositoryExists(repositoryName: string, config: EcrConfig): Promise<boolean> {
    const client = createEcrClient(config);

    try
    {
        const response = await client.describeRepositories({
            repositoryNames: [repositoryName]
        }).promise();

        if (response.$response.error) {
            throw `Failed to access ECR repository ${repositoryName}: ${response.$response.error}`;
        }

        console.log(response.repositories);
    }
    catch (ex)
    {
        const err = ex as AWSError;
        if (err.code == 'RepositoryNotFoundException')
            return false;

        throw ex;
    }

    return true;
}

function createEcrClient(config: EcrConfig) {
    return new sdk.ECR({
        accessKeyId: config.accessKey,
        secretAccessKey: config.secret,
        region: config.region,
        sessionToken: config.token
    });
}