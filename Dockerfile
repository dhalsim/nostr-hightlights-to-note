FROM oven/bun:latest AS build

WORKDIR /build

COPY . .

RUN bun install
RUN bun run build

FROM oven/bun:latest AS application

WORKDIR /application

COPY --from=build /build/build .
COPY --from=build /build/nostream-settings/settings.yaml ./.nostr/settings.yaml

CMD [ "bun", "run", "index.js" ]
