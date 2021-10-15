#!/bin/bash

# Setup logging
BLUE='\033[38;2;81;81;140m'
GREEN='\033[38;2;165;204;165m'
PINK='\033[38;2;241;204;209m'
RESET='\033[0m'

info() {
  timestamp=$(date +"%D ~%r")
  printf "%b\\n" "${GREEN}info${RESET}  | ${PINK}${timestamp}${RESET} ~ $1"
}

debug() {
  local debug="${ARISU_DEBUG:-false}"
  shopt -s nocasematch
  timestamp=$(date +"%D ~%r")

  if ! [[ "$debug" = "1" || "$debug" =~ ^(no|false)$ ]]; then
    printf "%b\\n" "${BLUE}debug${RESET} | ${PINK}${timestamp}${RESET} ~ $1"
  fi
}

# meaty details time uwu

info "now building docker containers..."

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
COMMIT="$(git rev-parse HEAD)"

echo ""
info "|> git info: under branch $BRANCH"
info "|> git info: commit: ${COMMIT:0:8}"

echo ""
info "docker: tsubaki: now building for $BRANCH (if branch is master, it'll default to \"latest\")"

if [[ "$BRANCH" == "master" ]]; then
  debug "tsubaki: changed directory to $(pwd)/app!"

  cd app
  docker build . -t "arisuland/tsubaki:latest" --no-cache
else
  debug "tsubaki: changed directory to $(pwd)/app!"

  cd app
  docker build . -t "arisuland/tsubaki:$BRANCH" --no-cache
fi

info "docker:  tsubaki: now building for commit ${COMMIT:0:8}"
debug "tsubaki: changed directory to $(pwd)/app."
cd app && docker build . -t "arisuland/tsubaki:${COMMIT:0:8}" --no-cache && cd ..

VERSION=$(cat ./app/package.json | jq '.version' | tr -d '"')
info "docker: tsubaki: building for version $VERSION..."
debug "tsubaki: changed directory to $(pwd)/app."
cd app && docker build . -t "arisuland/tsubaki:$VERSION" --no-cache && cd ..

echo ""
info "docker: github: now building for $BRANCH (if branch is master, it'll default to \"latest\")"
if [[ "$BRANCH" == "master" ]]; then
  debug "github: changed directory to $(pwd)/github-bot!"

  cd github-bot
  docker build . -t "arisuland/github:latest" --no-cache
else
  debug "github: changed directory to $(pwd)/github-bot!"

  cd github-bot
  docker build . -t "arisuland/github:$BRANCH" --no-cache
fi

info "docker: github: now building for commit ${COMMIT:0:8}"
debug "github: changed directory to $(pwd)/app."
cd github-bot && docker build . -t "arisuland/github:${COMMIT:0:8}" --no-cache && cd ..

VERSION=$(cat ./app/package.json | jq '.version' | tr -d '"')
info "docker: github: building for version $VERSION..."
debug "github: changed directory to $(pwd)/app."
cd github-bot && docker build . -t "arisuland/github:$VERSION" --no-cache && cd ..
