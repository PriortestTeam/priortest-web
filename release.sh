#!/bin/bash
yarn build:prod
ssh root@124.71.142.223 'cd /usr/local/nginx/html/website/ && rm -rf *'
scp -r dist/* root@124.71.142.223:/usr/local/nginx/html/website/