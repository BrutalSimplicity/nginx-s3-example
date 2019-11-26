FROM nginx:alpine
COPY deploy/nginx/nginx.conf /etc/nginx/nginx.conf
COPY deploy/docker/startup.sh /startup.sh
EXPOSE 80
STOPSIGNAL SIGTERM
CMD [ "./startup.sh" ]