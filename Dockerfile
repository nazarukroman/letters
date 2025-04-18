FROM node:23-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

COPY src ./src

RUN pnpm run build

FROM node:23-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]
