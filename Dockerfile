# syntax=docker/dockerfile:1

# Base images are pinned by tag (readable) and digest (immutable); Dependabot
# keeps both up to date.

# ---- Build: install dependencies and bundle the app with Vite --------------
FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS build

# Corepack provides the exact pnpm version pinned in `packageManager`; Husky's
# Git hooks are useless inside an image.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    HUSKY=0
RUN corepack enable

WORKDIR /app

# Manifests first, so the dependency layer is reused until they change.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# `VITE_*` values are inlined into the bundle at build time, so they are build
# arguments, not runtime environment variables.
ARG VITE_API_BASE_URL=/api
RUN pnpm build

# ---- Runtime: static files served by nginx as a non-root user --------------
FROM nginxinc/nginx-unprivileged:1.31.7-alpine@sha256:b5047b9b76845eac124358373c6852377c52e4b05834a47647e955dd91cb8f1e AS runtime

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# Outside conf.d/, which nginx loads automatically: this file is only included
# where `default.conf` asks for it.
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
