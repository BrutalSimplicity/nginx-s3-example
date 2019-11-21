docker build ../../ -f ../../deploy/docker/Dockerfile -t basic-nginx-proxy
docker tag basic-nginx-proxy:latest 233911428360.dkr.ecr.us-east-1.amazonaws.com/basic-nginx-proxy:latest
docker tag basic-nginx-proxy:latest 233911428360.dkr.ecr.us-east-1.amazonaws.com/basic-nginx-proxy:latest