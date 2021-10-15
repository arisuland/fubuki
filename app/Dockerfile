FROM node:16-alpine

# Setup Python 3 (for node-gyp with Kafka bindings)
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

LABEL MAINTAINER="Arisu Team <contact@arisu.land>, Noel <cutie@floofy.dev>"
RUN apk update && apk add --no-cache git ca-certificates git ca-certificates make gcc g++ bash

WORKDIR /app/Arisu/backend
COPY . .
RUN yarn global add typescript eslint
RUN yarn
RUN yarn build
RUN yarn cache clean

# Give it executable permissions
RUN chmod +x ./docker/start.sh

ENTRYPOINT [ "sh", "./docker/start.sh" ]
