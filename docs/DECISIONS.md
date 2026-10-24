# Decision log

The technical decisions behind this seed, with their status and the evidence they rest on.

## How to read this document

- **Status** is either **Final** (settled; revisit only if the context changes) or
  **Provisional** (the best choice today, with a known trigger to revisit — given in the
  _Revisit when_ column).
- **Sources** lists what each decision was checked against, and **how much of it was
  read**: _full_, _partial_ (only the relevant part), or _metadata_ (registry data, type
  definitions or source code inspected directly rather than prose documentation).
- Decisions marked "community practice" rest on widely shared conventions rather than on a
  single source; the [project guide](./PROJECT_GUIDE.md) explains the reasoning for each.

## What to do with it

- **Before changing a decision**, read its row and its sources; if the change is a reversal,
  update the row instead of adding a new one.
- **When a trigger fires** (for example, typescript-eslint ships TypeScript 7 support), work
  through that row: verify, change the code, and move the row to Final or update it.
- **When adding a tool or pattern**, add a row with its status and sources in the same PR.

## Decisions

### Platform & tooling

| #   | Decision                                                            | Status      | Revisit when                                                            |
| --- | ------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------- |
| 1   | SPA with React + Vite (no SSR meta-framework).                      | Final       | The app needs SEO or server rendering.                                  |
| 2   | TypeScript `~6.0.3`, not 7.x.                                       | Provisional | `typescript-eslint` supports TypeScript 7 (its peer range is `<6.1.0`). |
| 3   | Solution-style `tsconfig` (app + node programs) with a shared base. | Final       | —                                                                       |
| 4   | pnpm 12, `engineStrict`, `minimumReleaseAge: 1440` (one day).       | Provisional | The team settles on a different release-age policy.                     |
| 5   | One Node version (`.nvmrc` 24.x), no CI matrix.                     | Final       | Node 26 enters Active LTS: bump `.nvmrc`, Docker and `engines`.         |

### Application

| #   | Decision                                                       | Status      | Revisit when                                                            |
| --- | -------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------- |
| 6   | React Router (data router, `lazy` routes) for routing.         | Final       | —                                                                       |
| 7   | TanStack Query for server state; no global client-state store. | Final       | A real need for shared client state appears.                            |
| 8   | Zod validation of the environment and of every API response.   | Final       | —                                                                       |
| 9   | Plain CSS + CSS Modules; no CSS framework.                     | Provisional | A derived project picks a styling methodology (e.g. Tailwind).          |
| 10  | Build-time configuration only (`VITE_*` as Docker build args). | Provisional | One image must be promoted across environments → runtime `config.json`. |

### Quality & testing

| #   | Decision                                                                                                            | Status      | Revisit when                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------ |
| 11  | ESLint over Oxlint/Biome.                                                                                           | Provisional | Oxlint's type-aware and React rules match the current stack. |
| 12  | Official `react-hooks` plugin for hook rules; `@eslint-react` for the rest, with its duplicate hook rules disabled. | Final       | —                                                            |
| 13  | No `eslint-plugin-jsx-a11y`; accessibility checked with axe in e2e.                                                 | Provisional | A maintained JSX a11y plugin supports ESLint 10.             |
| 14  | `unicorn/no-asterisk-prefix-in-documentation-comments` off; `env` allowed as a name.                                | Final       | —                                                            |
| 15  | Lint fails on warnings (`--max-warnings=0`).                                                                        | Final       | —                                                            |
| 16  | Vitest + jsdom + Testing Library + MSW; 80% coverage thresholds.                                                    | Final       | —                                                            |
| 17  | Playwright e2e on Chromium, Firefox and WebKit, against the production build.                                       | Final       | —                                                            |

### Delivery & security

| #   | Decision                                                                                       | Status      | Revisit when                                                          |
| --- | ---------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------- |
| 18  | Multi-stage Docker image on `nginx-unprivileged`, base images pinned by tag + digest.          | Final       | —                                                                     |
| 19  | Baseline CSP and security headers in nginx; HSTS left to the TLS terminator.                   | Provisional | The deployment target is known (CDN, ingress) and headers move there. |
| 20  | CI tests the built image with the e2e suite (`E2E_BASE_URL`).                                  | Final       | —                                                                     |
| 21  | No release/versioning tool and no deploy workflow.                                             | Provisional | A derived project defines its deployment target or needs versions.    |
| 22  | Dependabot for npm (3-day cooldown), Actions and Docker; Node majors and nginx minors ignored. | Final       | —                                                                     |

## Sources

Checked while building the seed (October 2026):

| Source                                                                                                        | Read                    | Used for                                                                             |
| ------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------ |
| npm registry metadata (`pnpm view`): latest versions, `peerDependencies`, publish dates                       | metadata                | 2, 4, 11–13, all versions                                                            |
| Vite's official `react-ts` template, scaffolded with `create-vite` 9.3.1                                      | full                    | 1, 3, 11                                                                             |
| [pnpm v12.0.0 release notes](https://github.com/pnpm/pnpm/releases/tag/v12.0.0)                               | partial (major changes) | 4                                                                                    |
| pnpm 12.15.0 `CHANGELOG.md` (searched for `minimumReleaseAge`)                                                | partial                 | 4                                                                                    |
| pnpm install behaviour, observed: versions under ~1 day old were held back                                    | metadata                | 4                                                                                    |
| [Node.js release index](https://nodejs.org/dist/index.json)                                                   | metadata                | 5                                                                                    |
| Type definitions of `react-router` 8, `msw` 3, `@tanstack/react-query` 5                                      | metadata                | 6–8, 16                                                                              |
| Rule configs of `eslint-plugin-react-hooks` 7, `@eslint-react/eslint-plugin` 5, `eslint-plugin-react-refresh` | metadata                | 12                                                                                   |
| `eslint-plugin-unicorn` 78 rule sources (`name-replacements`, `no-asterisk-prefix-in-documentation-comments`) | metadata                | 14                                                                                   |
| [actions/setup-node v7.0.0 release notes](https://github.com/actions/setup-node/releases/tag/v7.0.0)          | full                    | CI                                                                                   |
| Docker Hub tags and registry digests for `node` and `nginxinc/nginx-unprivileged`                             | metadata                | 18                                                                                   |
| `typescript_library_seed` (the sibling seed this one was derived from)                                        | full                    | shared tooling: ESLint base, Prettier, markdownlint, hooks, CI layout, audit, CodeQL |

Not consulted directly (community practice, see the guide): Testing Library's guiding
principles, MSW's philosophy, OWASP's HTTP headers guidance, and React Router's and TanStack
Query's prose docs. Read them in full before overturning decisions 6, 7, 16 or 19.

## How to continue

Open items, in priority order:

1. **TypeScript 7** (row 2) — watch `typescript-eslint`'s peer range; when it includes 7.x,
   upgrade, run `pnpm verify`, and mark the row Final.
2. **Node 26 LTS** (row 5) — once it's LTS, bump `.nvmrc`, the Docker build image, the
   devcontainer and `engines`.
3. **Accessibility lint** (row 13) — re-check whether `eslint-plugin-jsx-a11y` (or a
   maintained fork) supports ESLint 10.
4. **nginx stable line** (row 22) — when nginx releases its next stable line (1.32), bump
   the runtime image tag and digest in the Dockerfile by hand.
5. **Deployment** (rows 19, 21) — when a derived project knows its target, add the deploy
   workflow and move security headers to the edge if appropriate.
