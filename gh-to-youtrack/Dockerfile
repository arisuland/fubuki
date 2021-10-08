FROM node:16-alpine

LABEL MAINTAINER="Arisu Team <contact@arisu.land>, Noel <cutie@floofy.dev>"
RUN apk update && apk add --no-cache git ca-certificates

WORKDIR /app/Arisu/microservices/gh-to-youtrack
COPY . .
RUN npm i -g typescript eslint
RUN yarn
RUN yarn build
RUN yarn cache clean

# Give it executable permissions
RUN chmod +x ./docker/start.sh

ENTRYPOINT [ "yarn", "start" ]
