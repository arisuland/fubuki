FROM node:16-alpine

LABEL MAINTAINER="Arisu Team <contact@arisu.land>"
RUN apk update && apk add git ca-certificates

WORKDIR /opt/floofy.dev
COPY . .
RUN yarn
RUN NUXT_TELEMETRY_DEBUG=1 NODE_ENV=production yarn build
RUN rm -rf src

ENTRYPOINT [ "nuxt", "start" ]
