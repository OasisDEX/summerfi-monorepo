# earn-protocol-landing-page

**Package:** `@summerfi/earn-protocol-landing-page`

The public marketing/landing site for the Lazy Summer Protocol. It is a Next.js 16 application built
as a fully static export (`output: 'export'`) served behind a CDN. It covers routes such as the
homepage, permissionless/permissioned vaults, staking, institutions, integrations, beach club,
build-your-own-vault, team, and legal pages (terms and privacy).

## Key entry points

- `app/layout.tsx` — root layout; mounts `LandingPageDataContextProvider`, `GoogleTagManager`, and
  `GlobalStyles`.
- `app/page.tsx` — homepage, pulls components from `@summerfi/app-earn-ui`.
- `next.config.ts` — enforces `output: 'export'`, enables `optimizePackageImports` for the six
  `@summerfi/*` workspace packages plus `mixpanel-browser` and `zod`, and exposes `EARN_APP_URL` to
  the runtime.

## Commands

| Purpose                                          | Script            |
| ------------------------------------------------ | ----------------- |
| Local dev (port 3003 + CSS-module type watching) | `pnpm dev`        |
| Production build                                 | `pnpm build:apps` |
| Serve the built output                           | `pnpm start`      |
| Lint                                             | `pnpm lint`       |
| Dead-code analysis                               | `pnpm knip`       |

Both `dev` and `build:apps` load `../../.env` and `../../.env.local` via `dotenv`.

`prebuild` (and the watch variant in `dev`) runs `tcm` to regenerate TypeScript types for every
`*.module.css` file under `components/`, `features/`, and `app/`. Re-run
`pnpm generate-module-types` after adding or renaming CSS module files.

## Cross-package connections

**Consumes:**

- `@summerfi/app-earn-ui` — all shared UI components and global styles.
- `@summerfi/app-types` — shared TypeScript types.
- `@summerfi/app-utils` — utility helpers (e.g. `slugify`).
- `@summerfi/sdk-client` / `@summerfi/sdk-client-react` / `@summerfi/sdk-common` — declared deps
  listed in `next.config.ts` `optimizePackageImports`; not currently imported anywhere in source.

**Consumed by:** Nothing in the monorepo imports this package; it is a leaf application.

**Required environment variables:**

- `EARN_APP_URL` — injected into the Next.js runtime via `next.config.ts`; must be set before build.
- `NEXT_PUBLIC_EARN_MIXPANEL_KEY` — Mixpanel tracking key; analytics silently disables itself when
  absent.

**Gotcha — CSS module types:** The generated `.d.ts` files from `tcm` are not committed. Run
`pnpm generate-module-types` (or start `dev`) before TypeScript will accept `*.module.css` imports;
CI runs it automatically via `prebuild`.
