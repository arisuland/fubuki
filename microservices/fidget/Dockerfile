FROM elixir:1.12-alpine

RUN mix local.hex --force
RUN mix local.rebar --force

WORKDIR /app/fidget
RUN apk update && apk add git ca-certificates curl
COPY . /app/fidget/
RUN mix deps.get
RUN MIX_ENV=prod mix compile --warnings-as-errors

CMD ["sh", "./docker/docker-entrypoint.sh"]
