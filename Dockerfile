#FROM rust:latest as builder
#WORKDIR /app
#COPY ./Cargo.lock ./Cargo.lock
#COPY ./Cargo.toml ./Cargo.toml
#COPY ./server ./server
#RUN cargo build -p server --release
#
#FROM debian:bookworm-slim
#WORKDIR /app
#COPY --from=builder /app/target/release/server ./server
#COPY temp_dist ./temp_dist

#CMD ["./server"]

FROM clux/muslrust:stable as builder
RUN groupadd -g 10001 -r dockergrp && useradd -r -g dockergrp -u 10001 dockeruser
WORKDIR /app
COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
COPY ./server ./server
RUN rustup target add x86_64-unknown-linux-musl
RUN cargo build -p server --release --target x86_64-unknown-linux-musl


FROM scratch
COPY --from=0 /etc/passwd /etc/passwd
USER dockeruser
ENV RUST_LOG="error,$BINARY_NAME=info"
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/server /server
COPY temp_dist ./temp_dist
CMD ["/server"]
