FROM node:17-alpine AS builder

ARG version="unknown"
ARG commit_hash="unknown"

LABEL MAINTAINER="Arisu Team <contact@arisu.land>, Noel <cutie@floofy.dev>"
LABEL land.arisu.fubuki.version=${version}
LABEL land.arisu.fubuki.commit-hash=${commit_hash}

RUN apk update && apk add --no-cache git ca-certificates make gcc g++ bash
WORKDIR /build/fubuki
COPY . .

RUN yarn global add typescript eslint
RUN yarn
RUN yarn build
RUN yarn cache remove

FROM node:17-alpine

WORKDIR /app/arisu/fubuki
COPY --from=builder /build/fubuki/node_modules /app/arisu/fubuki/node_modules
COPY --from=builder /build/fubuki/build        /app/arisu/fubuki/build

ENTRYPOINT [ "yarn", "start" ]
