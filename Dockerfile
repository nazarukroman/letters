FROM clux/muslrust:stable AS builder
RUN groupadd -g 10001 -r dockergrp && useradd -r -g dockergrp -u 10001 dockeruser
WORKDIR /app
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./server ./server
RUN rustup target add x86_64-unknown-linux-musl
RUN cargo build -p server --release --target x86_64-unknown-linux-musl


FROM node:lts-alpine AS client-builder
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./client ./client
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm -F client run build

FROM scratch
COPY --from=0 /etc/passwd /etc/passwd
USER dockeruser
ARG BINARY_NAME
ENV RUST_LOG="error,$BINARY_NAME=info"
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/server /server
COPY --from=client-builder /app/client/dist /client/dist
CMD ["/server"]
