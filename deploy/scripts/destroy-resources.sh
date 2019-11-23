#!/bin/bash

source env.sh
IMAGE_DIGEST=$(aws ecr describe-images --repository-name $STACK_ID-nginx-proxy --query "imageDetails[0].imageDigest" --output text)
aws ecr batch-delete-image --repository-name $STACK_ID-nginx-proxy --image-ids imageDigest=$IMAGE_DIGEST
cdk -a "source env.sh; npx ts-node --dir ../cloudformation ../cloudformation/bin/cloudformation.ts" destroy --force $STACK_ID-ecr #$STACK_ID-vpc $STACK_ID-s3 $STACK_ID-fargate