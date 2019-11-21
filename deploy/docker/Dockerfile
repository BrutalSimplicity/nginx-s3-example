FROM nginx:alpine
COPY deploy/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]