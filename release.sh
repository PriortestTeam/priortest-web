#!/bin/bash
yarn build:prod
rsync -avr --delete-after dist/* root@139.199.1.252/usr/local/nginx/html/website/