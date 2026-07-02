# @summerfi/earn-protocol

Next.js 16 application (base path `/earn`) that serves the Summer.fi Earn product: vault discovery,
deposit/withdraw flows, SUMR staking, portfolio views, and RWA (institutions-v2) vault pages. It
runs on port 3002 in development and is deployed as a standalone Next.js output behind a CDN.

## Key entry points

- `app/` — Next.js App Router pages and layouts; `app/server-handlers/` contains all SSR
  data-fetching logic (vault lists, subgraph queries, SDK calls, portfolio, staking).
- `app/server-handlers/subgraphs-map.ts` — maps each supported network to its subgraph URL (Mainnet:
  `$SUBGRAPH_BASE/summer-protocol`; other chains: `$SUBGRAPH_BASE/summer-protocol-<chain>` e.g.
  `-base`, `-arbitrum`, `-sonic`, `-hyperliquid`). `rwaSubgraphsMap` (Mainnet:
  `summer-institutions-v2-staging`; Base: `summer-institutions-v2-base-staging`) is the app's single
  source of truth for which chains have an RWA subgraph — `rwaSupportedSdkNetworks`,
  `rwaSupportedChainIds`, and `rwaSubgraphUrlByChainId` all derive from it.
- `constants/networks-list.ts` — app-local `NetworkNames`/`NetworkIds` enums and
  `SDKChainIdToRpcGatewayMap` (client-side RPC via `/earn/api/rpcGateway`).
- `helpers/rpc-gateway-ssr.ts` — `SDKChainIdToSSRRpcGatewayMap` for server-side RPC; must not be
  imported in client components.
- `constants/rwa.ts` — `RWA_INSTI_VERSION` (`'v2'`), shared by every RWA institution when
  constructing the institutional SDK client. The per-institution `Client-Id` is not a constant: it
  is derived from each vault's `vaultInstitutionId` fleet-config field via `getVaultRwaClientId` /
  `getRwaClientIdsForChain` in `helpers/vault-custom-value-helpers.ts`.
- `graphql/clients/` — auto-generated GraphQL clients for `rates`, `position-history`,
  `rwa-vault-nav-history`, and `rwa-receipts-history`; regenerate with `pnpm codegen`.

## Build / dev commands

| Command           | What it does                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| `pnpm dev`        | Starts Next.js dev server on port 3002 with CSS-module type watching         |
| `pnpm build:apps` | Runs codegen + module-type generation, then `next build --webpack`           |
| `pnpm start`      | Serves the built standalone output on port 3002                              |
| `pnpm codegen`    | Regenerates GraphQL clients in `graphql/clients/` from live subgraph schemas |
| `pnpm lint`       | TypeScript type-check + ESLint                                               |

`prebuild` runs `codegen` and `generate-module-types` concurrently; both must succeed before
`next build`.

## Cross-package connections

**Consumes:** `@summerfi/app-earn-ui`, `@summerfi/app-icons`, `@summerfi/app-risk`,
`@summerfi/app-server-handlers`, `@summerfi/app-tos`, `@summerfi/app-types`, `@summerfi/app-utils`,
`@summerfi/sdk-client`, `@summerfi/sdk-client-react`, `@summerfi/sdk-common`,
`@summerfi/armada-protocol-abis`, `@summerfi/armada-protocol-common`,
`@summerfi/subgraph-manager-common`, `@summerfi/summer-protocol-db`,
`@summerfi/summer-beach-club-db`, `@summerfi/serverless-shared`.

**Consumed by:** nothing in the monorepo — this is a leaf application.

**Gotchas:**

- **New chain:** add entries to `constants/networks-list.ts` (both enums +
  `SDKChainIdToRpcGatewayMap`), `helpers/rpc-gateway-ssr.ts` (`SDKChainIdToSSRRpcGatewayMap`),
  `app/server-handlers/subgraphs-map.ts`, and `constants/network-id-to-icon.tsx`. Per-network
  `next.config.ts` redirects to `pro.summer.fi` may also need a new entry.
- **New RWA fleet / institution / chain:** RWA discovery is config-driven.
  `app/server-handlers/sdk/get-rwa-vaults-list.ts` iterates `rwaSupportedChainIds` (from
  `rwaSubgraphsMap`) and, per chain, `getRwaClientIdsForChain(...)` — client IDs come from each
  fleet's `vaultInstitutionId` config field. Onboarding a new institution means setting
  `vaultInstitutionId` in the fleet config; onboarding a new RWA chain is a one-line edit to
  `rwaSubgraphsMap`.
- **GraphQL codegen:** `graphql/clients/` files are generated; run `pnpm codegen` after any subgraph
  schema change. `$SUBGRAPH_BASE` must be set (via `.env` / `.env.local`) at codegen time.
- **CSS module types:** `graphql/clients/` aside, `.module.css` typings in `components/`,
  `features/`, and `app/` are also generated — run `pnpm generate-module-types` or use the watch
  mode in `dev`.
- **Env vars:** `SUBGRAPH_BASE`, `EARN_APP_URL`, `CONFIG_URL_EARN`,
  `EARN_PROTOCOL_DB_CONNECTION_STRING`, `EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING` must be
  present; wallet/auth vars (`PRIVY_*`, `INSTITUTIONS_COGNITO_*`) are also required at runtime.
