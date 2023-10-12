FROM node:latest AS prebuild

WORKDIR /app

COPY . /app

RUN yarn

ARG SERVICEENDPOINT=http://ec2-52-53-156-68.us-west-1.compute.amazonaws.com:3000

RUN yarn build

FROM nginx:mainline-alpine-slim

COPY --from=prebuild /app/dist /usr/share/nginx/html



