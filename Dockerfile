FROM nginx:1.14.2-alpine

COPY dist /app
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
