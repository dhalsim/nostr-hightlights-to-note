FROM oven/bun:latest AS build

WORKDIR /build

COPY . .

RUN bun install
RUN bun run build

FROM oven/bun:latest AS application

WORKDIR /application

COPY --from=build /build/build .

CMD [ "bun", "run", "index.js" ]
