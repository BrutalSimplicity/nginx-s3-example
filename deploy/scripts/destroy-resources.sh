#!/bin/bash

source env.sh
IMAGE_DIGEST=$(aws ecr list-images --repository-name $STACK_ID-nginx-proxy --query "imageIds[*]")
aws ecr batch-delete-image --repository-name $STACK_ID-nginx-proxy --image-ids "$IMAGE_DIGEST"
aws s3 rm s3://$BUCKET_ID --recursive
cdk -a "source env.sh; npx ts-node --dir ../cloudformation ../cloudformation/bin/cloudformation.ts" destroy --force $STACK_ID-ecr $STACK_ID-vpc $STACK_ID-s3 $STACK_ID-fargate