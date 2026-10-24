# Contributing guide

Thanks for your interest in contributing! 🎉

## Requirements

- Node.js `>=24` (recommended: the version in [`.nvmrc`](./.nvmrc))
- pnpm `>=12` (`corepack enable`)

## Getting started

```bash
pnpm install
pnpm exec playwright install   # browsers for the e2e tests, once per machine
```

## Workflow

1. Create a branch from `main`.
2. Code with the inner dev loop running:

   ```bash
   pnpm dev    # Vite dev server with hot reload
   pnpm test   # Vitest in watch mode
   ```

   The code is split by responsibility: the app shell (route table, layout) in `src/app/`,
   thin page components in `src/routes/`, feature modules (queries + components) in
   `src/features/`, and shared infrastructure in `src/lib/` and `src/config/`. Unit tests
   live next to the code (`*.test.ts(x)`); browser tests live in `e2e/`. The editor applies
   ESLint + Prettier on save (see [`.vscode/settings.json`](./.vscode/settings.json)).

3. Verify everything passes — one script, and the very same one CI runs:

   ```bash
   pnpm verify
   ```

   It chains, in order: `lint` → `lint:md` → `format:check` → `typecheck` → `knip` →
   `test:coverage` → `build` → `test:e2e`. Green locally means green in CI.

   Dependency advisories are checked separately with `pnpm check:audit`, because that one
   depends on the registry rather than on your changes.

4. Commit following [Conventional Commits](https://www.conventionalcommits.org/) (you can
   use `pnpm commit`). Husky hooks run automatically: **pre-commit** → `lint-staged`,
   **commit-msg** → `commitlint`.
5. Open a Pull Request against `main`. CI runs `pnpm verify`, builds the Docker image and
   runs the e2e tests against it, audits the production dependencies, and runs a CodeQL
   scan.

## Conventions

- **Commits**: Conventional Commits (validated by commitlint).
- **File names**: `kebab-case` for every file (enforced by `unicorn/filename-case`);
  components themselves are `PascalCase` (`health-status.tsx` exports `HealthStatus`).
- **Imports**: relative and extensionless; Vite and TypeScript resolve them in bundler mode.
- **Exports**: named exports only in `src/`, so a thing has the same name everywhere it is
  imported. (Root config files use default exports because their tools require it.)
- **Formatting**: Prettier (automatic on pre-commit via lint-staged).
- **Linting**: ESLint with type-checked rules; run `pnpm lint:fix` to apply safe fixes.
- **Accessibility**: query elements by role in tests (`getByRole`), as users and assistive
  technology see them; the e2e suite fails on any axe violation.

## Using this repository as a template

After creating a project from this template:

1. **Rename** — set `name` and `repository` in [`package.json`](./package.json), the
   `<title>` and description in [`index.html`](./index.html), and the page titles in
   `src/routes/`.
2. **Replace the example** — `src/features/health/` and the `/status` route show the
   data-fetching pattern end to end; swap them for your first real feature.
3. **Point at your backend** — set `API_PROXY_TARGET` (dev) and `VITE_API_BASE_URL` (build)
   as described in [`.env.example`](./.env.example). If the API lives on another origin,
   add it to `connect-src` in [`nginx/security-headers.conf`](./nginx/security-headers.conf).
4. **Wire deployment** — the image is built and tested in CI but not pushed anywhere,
   because the target (a registry plus Kubernetes, a PaaS, static hosting…) is
   project-specific. Add a deploy workflow for yours.

## Releases

This is an application, not a package: it is **deployed**, not published, so there is no
version bump or changelog tooling. Every commit on `main` is a releasable build, identified
by its commit SHA. If your project needs human-readable versions (for example, for mobile
wrappers or customer-facing release notes), add a release tool such as
[release-please](https://github.com/googleapis/release-please) on top of the Conventional
Commits history.
