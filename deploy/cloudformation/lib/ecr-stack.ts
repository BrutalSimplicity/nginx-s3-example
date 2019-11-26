import cdk = require('@aws-cdk/core');
import { Repository, IRepository } from '@aws-cdk/aws-ecr';
import { RemovalPolicy } from '@aws-cdk/core';

export interface EcrStackProps {
    stack?: cdk.StackProps;
    imageName: string;
}

export class EcrStack extends cdk.Stack {
    readonly repository: IRepository;

    constructor(scope: cdk.Construct, id: string, props: EcrStackProps) {
        super(scope, id, props.stack);

        this.repository = new Repository(this, 'repository', {
            repositoryName: props.imageName,
            removalPolicy: RemovalPolicy.DESTROY
        });
    }
}
