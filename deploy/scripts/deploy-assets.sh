#!/bin/bash

source env.sh
npm --prefix ../../basic-app run build
aws s3 cp ../../basic-app/build/ s3://$BUCKET_ID/ --recursive