FROM node:lts-alpine AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json client/
COPY server/package.json server/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY client/ client/
RUN pnpm -F client run build

COPY db/words.tsv db/
COPY server/ server/
RUN pnpm -F letters-server run seed

FROM node:lts-alpine
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json server/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

COPY server/src/ server/src/
COPY --from=builder /app/client/dist client/dist
COPY --from=builder /app/db/words.db db/words.db

RUN addgroup -g 10001 -S appgrp && adduser -u 10001 -S appusr -G appgrp \
    && chown appusr:appgrp db/words.db
USER appusr

ENV SERVER_PORT=4000
ENV STATIC_DIR_PATH=/app/client/dist
ENV DB_PATH=/app/db/words.db

EXPOSE 4000
CMD ["node", "server/src/index.js"]
