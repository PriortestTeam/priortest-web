#!/bin/bash
yarn build:prod
ssh root@196.168.56.101 'cd /usr/local/nginx/html/website/ && rm -rf *'
scp -r dist/* root@196.168.56.101:/usr/local/nginx/html/website/
