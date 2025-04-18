FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN apk add --no-cache curl \
 && corepack enable \
 && corepack prepare pnpm@latest --activate \
 && pnpm install --frozen-lockfile

COPY . .

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "main.js"]
