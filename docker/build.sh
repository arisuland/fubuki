#!/bin/bash

. "$PWD/bin/liblog.sh"
info "now building docker containers..."

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
COMMIT="$(git rev-parse HEAD)"
COMMIT_HASH="${COMMIT:0:8}"
VERSION=$(cat ./app/package.json | jq '.version' | tr -d '"')
GITHUB_BOT_VERSION=$(cat ./github-bot/package.json | jq '.version' | tr -d '"')

echo ""
info "|> git info: under branch $BRANCH"
info "|> git info: commit: ${COMMIT:0:8}"

echo ""
info "docker: tsubaki: now building for $BRANCH (if branch is master, it'll default to \"latest\")"

if [[ "$BRANCH" == "master" ]]; then
  debug "tsubaki: changed directory to $(pwd)/app!"

  cd app
  docker build . -t "arisuland/tsubaki:latest" --no-cache --build-arg version="$VERSION" --build-arg commit_hash="${COMMIT:0:8}"
  cd ..
else
  debug "tsubaki: changed directory to $(pwd)/app!"

  cd app
  docker build . -t "arisuland/tsubaki:$BRANCH" --no-cache --build-arg version="$VERSION" --build-arg commit_hash="${COMMIT:0:8}"
  cd ..
fi

info "docker: tsubaki: now building for commit $COMMIT_HASH"
debug "tsubaki: changed directory to $(pwd)/app."
cd app && docker build . -t "arisuland/tsubaki:$COMMIT_HASH" --no-cache --build-arg version="$VERSION" --build-arg commit_hash="${COMMIT:0:8}" && cd ..

info "docker: tsubaki: building for version $VERSION..."
debug "tsubaki: changed directory to $(pwd)/app."
cd app && docker build . -t "arisuland/tsubaki:$VERSION" --no-cache --build-arg version="$VERSION" --build-arg commit_hash="${COMMIT:0:8}" && cd ..

echo ""
info "docker: github: now building for $BRANCH (if branch is master, it'll default to \"latest\")"
if [[ "$BRANCH" == "master" ]]; then
  debug "github: changed directory to $(pwd)/github-bot!"

  cd github-bot
  docker build . -t "arisuland/github:latest" --no-cache --build-arg version="$GITHUB_BOT_VERSION" --build-arg commit_hash="${COMMIT:0:8}"
  cd ..
else
  debug "github: changed directory to $(pwd)/github-bot!"

  cd github-bot
  docker build . -t "arisuland/github:$BRANCH" --no-cache --build-arg version="$GITHUB_BOT_VERSION" --build-arg commit_hash="${COMMIT:0:8}"
  cd ..
fi

info "docker: github: now building for commit $COMMIT_HASH"
debug "github: changed directory to $(pwd)/github-bot."
cd github-bot && docker build . -t "arisuland/github:$COMMIT_HASH" --no-cache --build-arg version="$GITHUB_BOT_VERSION" --build-arg commit_hash="${COMMIT:0:8}" && cd ..

info "docker: github: building for version $GITHUB_BOT_VERSION..."
debug "github: changed directory to $(pwd)/github-bot."
cd github-bot && docker build . -t "arisuland/github:$GITHUB_BOT_VERSION" --no-cache --build-arg version="$GITHUB_BOT_VERSION" --build-arg commit_hash="${COMMIT:0:8}" && cd ..
