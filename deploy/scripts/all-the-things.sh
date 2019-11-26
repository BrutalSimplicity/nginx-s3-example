#!/bin/bash

./provision-ecr-resources.sh
./deploy-image.sh
./provision-fargate-resources.sh
./deploy-assets.sh