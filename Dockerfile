# syntax=docker/dockerfile:1

# Base images are pinned by tag (readable) and digest (immutable); Dependabot
# keeps both up to date.

# ---- Build: install dependencies and bundle the app with Vite --------------
FROM node:24.22.3-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS build

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
FROM nginxinc/nginx-unprivileged:1.30.6-alpine@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03 AS runtime

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# Outside conf.d/, which nginx loads automatically: this file is only included
# where `default.conf` asks for it.
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
