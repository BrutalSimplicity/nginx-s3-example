#!/bin/bash

source env.sh; aws ecs update-service --service $SERVICE_NAME --cluster $CLUSTER_NAME --force-new-deployment