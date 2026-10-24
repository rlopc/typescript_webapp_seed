# typescript-webapp-seed

> A modern seed for React single-page applications — strict TypeScript, Vite, tested end to
> end, shipped as a hardened container.

A starter template gathering current best practices for a **frontend** web app that runs in
the browser and talks to a separate backend over HTTP.

## Features

- **React 19 + Vite 8** — fast dev server with HMR, optimized production build, route-level
  code splitting.
- **Strict `tsconfig`** — `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `verbatimModuleSyntax`, and more, with separate programs for browser and Node code.
- **Routing** — [React Router](https://reactrouter.com/) with a root layout, a not-found page
  and an error boundary.
- **Server state** — [TanStack Query](https://tanstack.com/query) for fetching and caching,
  over a small typed `fetch` client.
- **Validation at the boundaries** — [Zod](https://zod.dev/) checks both the build-time
  environment and every API response.
- **Code quality** — ESLint (flat config, type-checked) with the official React Hooks
  plugin, `@eslint-react`, `unicorn` and `sonarjs`, plus Prettier and markdownlint.
- **Tests** — Vitest + Testing Library + MSW for components and data fetching, with coverage
  thresholds; Playwright for cross-browser e2e tests with automated accessibility checks
  (axe).
- **Production container** — multi-stage Docker build served by unprivileged nginx with SPA
  fallback, long-term asset caching and security headers (CSP and friends).
- **Conventional commits** — Husky + lint-staged + commitlint + Commitizen.
- **Dead-code & dependency checks** — `knip` flags unused files, exports, and dependencies.
- **Supply-chain hardening** — pnpm `minimumReleaseAge`, CodeQL, GitHub Actions and base
  images pinned to digests, and a weekly `pnpm audit` gate.

## Requirements

- Node.js `>=24` (the exact version is in [`.nvmrc`](./.nvmrc))
- pnpm `>=12` (`corepack enable`)
- Docker, only to build or run the production image

## Getting started

```bash
pnpm install
pnpm exec playwright install   # once: browsers for the e2e tests
pnpm dev                       # http://localhost:5173
```

The dev server proxies `/api` to `http://localhost:3000`. Point it elsewhere, or change the
API base URL the browser uses, through `.env.local` — see [`.env.example`](./.env.example).

## Scripts

| Script                              | Description                                        |
| ----------------------------------- | -------------------------------------------------- |
| `pnpm dev`                          | Start the Vite dev server.                         |
| `pnpm build`                        | Build the production bundle into `dist/`.          |
| `pnpm preview`                      | Serve `dist/` locally.                             |
| `pnpm verify`                       | Run every CI gate, in the same order.              |
| `pnpm typecheck`                    | Type-check all programs (`tsc --build`).           |
| `pnpm lint` / `pnpm lint:fix`       | Lint with ESLint.                                  |
| `pnpm lint:md` / `pnpm lint:md:fix` | Lint Markdown with markdownlint.                   |
| `pnpm format` / `pnpm format:check` | Format with Prettier.                              |
| `pnpm knip`                         | Find unused files, exports & dependencies.         |
| `pnpm test` / `pnpm test:run`       | Unit tests with Vitest (watch / single run).       |
| `pnpm test:coverage`                | Unit tests with coverage thresholds.               |
| `pnpm test:e2e`                     | Playwright e2e tests against the production build. |
| `pnpm check:audit`                  | Audit production dependencies (high severity).     |
| `pnpm commit`                       | Guided commit (Commitizen).                        |

## Production image

```bash
docker build -t my-app .
docker run --rm -p 8080:8080 my-app   # http://localhost:8080
```

`VITE_*` variables are inlined at **build** time, so they are passed as build arguments:
`docker build --build-arg VITE_API_BASE_URL=https://api.example.com -t my-app .` (then add
that origin to `connect-src` in [`nginx/security-headers.conf`](./nginx/security-headers.conf)).

## Structure

```text
.
├── src/
│   ├── main.tsx              # entry: mounts providers + router into #root
│   ├── styles.css            # global styles and design tokens
│   ├── app/                  # app shell: route table, root layout
│   ├── routes/               # one component per page (thin)
│   ├── features/             # feature modules: API queries + components
│   │   └── health/
│   ├── lib/api-client.ts     # typed fetch wrapper with response validation
│   ├── config/env.ts         # validated build-time environment
│   └── test/                 # test setup, MSW server, render helpers
├── e2e/                      # Playwright tests (incl. accessibility)
├── nginx/                    # production server config
├── Dockerfile                # multi-stage build → unprivileged nginx
├── vite.config.ts            # Vite + Vitest config
└── playwright.config.ts      # e2e config
```

## Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md) — workflow and conventions.
- [docs/PROJECT_GUIDE.md](./docs/PROJECT_GUIDE.md) — every tool and decision, explained.
- [docs/DECISIONS.md](./docs/DECISIONS.md) — decision log with status and sources.

## License

[MIT](./LICENSE) © rlopc
