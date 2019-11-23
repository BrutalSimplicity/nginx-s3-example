#!/bin/bash

source env.sh
cdk -a "source env.sh; npx ts-node --dir ../cloudformation ../cloudformation/bin/cloudformation.ts" --require-approval=never deploy $STACK_ID-vpc $STACK_ID-s3 $STACK_ID-fargate