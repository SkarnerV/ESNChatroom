FROM node:latest AS prebuild

WORKDIR /app

COPY . /app

RUN yarn

ARG SERVICEENDPOINT=https://f23esnb1.eastus.cloudapp.azure.com/api

RUN yarn build

FROM nginx:mainline-alpine-slim

COPY --from=prebuild /app/dist /usr/share/nginx/html



