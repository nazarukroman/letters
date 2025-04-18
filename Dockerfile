FROM node:23-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY src ./src
COPY client ./client

RUN pnpm run build

FROM node:23-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client ./client

CMD ["node", "dist/index.js"]
