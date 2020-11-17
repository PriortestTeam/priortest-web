FROM nginx:1.14.2-alpine
ENV HOST 0.0.0.0

COPY dist /app
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
