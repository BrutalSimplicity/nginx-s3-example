#!/bin/bash

source env.sh;
docker build ../../ -f ../../deploy/docker/Dockerfile -t $IMAGE_NAME --no-cache
HASH=$(git rev-parse HEAD)
docker tag $IMAGE_NAME:latest $CDK_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/$IMAGE_NAME:latest
docker tag $IMAGE_NAME:latest $CDK_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/$IMAGE_NAME:${HASH:0:20}

$(aws ecr get-login --no-include-email)

docker push $CDK_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/$IMAGE_NAME:latest
docker push $CDK_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/$IMAGE_NAME:${HASH:0:20}
