#!/bin/sh

envsubst '${BUCKET_DOMAIN}' </etc/nginx/nginx.conf > nginx.conf
mv nginx.conf /etc/nginx/nginx.conf
nginx -g "daemon off;"