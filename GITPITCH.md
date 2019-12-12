--- 

Serving S3 Assets via Nginx and Fargate (Pt. 1)

---

@ul
- Why

- What

- How
@ulend

--- 

Nginx

---

Contexts

- Events
- Server
- Http
- Location

---

Basic Configuration

```
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    server {
	    listen       80;
	    server_name  localhost;

	    location / {
	        root   /usr/share/nginx/html;
	        index  index.html index.htm;
	    }
	}
}

```