# 이미지 pull
FROM nginx:1.17.4-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY .config/prod/nginx/nginx.conf /etc/nginx/conf.d