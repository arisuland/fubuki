FROM node:16-alpine

LABEL MAINTAINER="Arisu Team <contact@arisu.land>"
RUN apk update && apk add git ca-certificates

WORKDIR /opt/Arisu/backend
COPY . .
RUN apk add --no-cache git
RUN npm i -g typescript eslint prisma
RUN yarn install --pure-lockfile --non-interactive
RUN yarn build

RUN chmod +x ./scripts/run-docker.sh

CMD [ "yarn", "start" ]
