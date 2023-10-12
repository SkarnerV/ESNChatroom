FROM node:latest AS deps

WORKDIR /app

COPY . /app

RUN yarn install --prod

FROM node:latest AS builder

WORKDIR /app

COPY . /app

RUN yarn

RUN yarn build

FROM gcr.io/distroless/nodejs18-debian12:latest

WORKDIR /app

COPY --from=builder /app/dist /app/dist

COPY --from=deps /app/node_modules /app/node_modules

EXPOSE 3000

CMD [ "dist/index.js" ]