FROM node:16-alpine

LABEL MAINTAINER="Arisu Team <contact@arisu.land>"
RUN apk update && apk add git ca-certificates

WORKDIR /opt/Arisu/frontend
COPY . .
RUN npm i -g typescript eslint
RUN yarn
RUN NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production yarn build
RUN rm -rf src

ENTRYPOINT [ "nuxt", "start" ]
