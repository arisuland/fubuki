# Setup build args
ARG version=unknown
ARG commit_hash=unknown

# Retrieve Tsubaki (backend)
FROM arisuland/tsubaki:latest AS tsubaki

# Retrieve Fubuki (frontend)
FROM arisuland/fubuki:latest AS fubuki

# Now, we do stuff here 0w0
FROM alpine:latest

# Setup the user and group
ENV USERNAME=arisu
ENV USER_UID=1000
ENV USER_GID=${USER_UID}

WORKDIR /var/lib/arisu
COPY . .

# Create the correct directories
RUN mkdir -p /var/lib/arisu/{tsubaki,fubuki}

COPY scripts/liblog.sh /var/lib/arisu/scripts/liblog.sh
COPY --from=tsubaki /app/arisu/tsubaki/build /var/lib/arisu/tsubaki/build
COPY --from=tsubaki /app/arisu/tsubaki/node_modules /var/lib/arisu/tsubaki/node_modules

COPY --from=fubuki /app/arisu/fubuki/.next /var/lib/arisu/fubuki/.next
COPY --from=fubuki /app/arisu/fubuki/node_modules /var/lib/arisu/fubuki/node_modules

# Make the `docker-entrypoint.sh` executable
RUN chmod +x docker-entrypoint.sh

USER ${USERNAME}
ENTRYPOINT [ "bash", "/var/lib/arisu/docker-entrypoint.sh" ]
