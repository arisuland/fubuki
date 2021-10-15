#!/bin/bash

. "$PWD/bin/liblog.sh"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
COMMIT="$(git rev-parse HEAD)"
VERSION=$(cat ./app/package.json | jq '.version' | tr -d '"')
GITHUB_BOT_VERSION=$(cat ./github-bot/package.json | jq '.version' | tr -d '"')

info "tsubaki: now publishing packages to Docker Hub!"
docker push "arisuland/tsubaki:$VERSION"
docker push "arisuland/tsubaki:${COMMIT:0:8}"

if [[ "$BRANCH" == "master" ]]; then
  docker push "arisuland/tsubaki:latest"
else
  docker push "arisuland/tsubaki:$BRANCH"
fi

info "tsubaki: published tsubaki:$BRANCH, tsubaki:${COMMIT:0:8}, tsubaki:$VERSION!"

echo ""
info "github: publishing packages to Docker Hub!"
docker push "arisuland/github:$VERSION"
docker push "arisuland/github:${COMMIT:0:8}"

if [[ "$BRANCH" == "master" ]]; then
  docker push "arisuland/github:latest"
else
  docker push "arisuland/github:$BRANCH"
fi

info "github: published github:$BRANCH, github:${COMMIT:0:8}, github:$VERSION!"
