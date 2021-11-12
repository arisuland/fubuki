FROM node:17-alpine AS builder

ARG version="unknown"
ARG commit_hash="unknown"

# Setup Python 3
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

# Work on build
LABEL MAINTAINER="Arisu Team <contact@arisu.land>, Noel <cutie@floofy.dev>"
LABEL land.arisu.tsubaki.version=${version}
LABEL land.arisu.tsubaki.commit-hash=${commit_hash}

RUN apk update && apk add --no-cache git ca-certificates make gcc g++ bash

WORKDIR /app
COPY . .
RUN yarn global add typescript eslint
RUN yarn
RUN yarn build
RUN yarn cache clean
RUN rm -rf src scripts

FROM node:17-alpine

WORKDIR /app/arisu/tsubaki

COPY --from=builder /app/node_modules /app/arisu/tsubaki/node_modules
COPY --from=builder /app/build /app/arisu/tsubaki/build
COPY docker /app/arisu/tsubaki/docker
RUN chmod +x ./docker/start.sh

ENTRYPOINT [ "sh", "./docker/start.sh" ]
