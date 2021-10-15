#!/bin/bash

BLUE='\033[38;2;81;81;140m'
GREEN='\033[38;2;165;204;165m'
PINK='\033[38;2;241;204;209m'
RESET='\033[0m'
BOLD='\033[1m'
UNDERLINE='\033[4m'

info() {
  timestamp=$(date +"%D ~ %r")
  printf "%b\\n" "${GREEN}${BOLD}info${RESET}  | ${PINK}${BOLD}${timestamp}${RESET} ~ $1"
}

debug() {
  local debug="${ARISU_DEBUG:-false}"
  shopt -s nocasematch
  timestamp=$(date +"%D ~%r")

  if ! [[ "$debug" = "1" || "$debug" =~ ^(no|false)$ ]]; then
    printf "%b\\n" "${BLUE}${BOLD}debug${RESET} | ${PINK}${BOLD}${timestamp}${RESET} ~ $1"
  fi
}
