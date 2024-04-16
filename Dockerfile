FROM nginx

LABEL maintainer="Leon Enneken"

COPY nginx.conf /etc/nginx/nginx.conf

COPY dist/fuse /usr/share/nginx/html