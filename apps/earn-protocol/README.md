# @summerfi/earn-protocol

Next.js 16 application (base path `/earn`) that serves the Summer.fi Earn product: vault discovery,
deposit/withdraw flows, SUMR staking, portfolio views, and RWA (institutions-v2) vault pages. It
runs on port 3002 in development and is deployed as a standalone Next.js output behind a CDN.

## Key entry points

- `app/` — Next.js App Router pages and layouts; `app/server-handlers/` contains all SSR
  data-fetching logic (vault lists, subgraph queries, SDK calls, portfolio, staking).
- `app/server-handlers/subgraphs-map.ts` — maps each supported network to its subgraph URL (Mainnet:
  `$SUBGRAPH_BASE/summer-protocol`; other chains: `$SUBGRAPH_BASE/summer-protocol-<chain>` e.g.
  `-base`, `-arbitrum`, `-sonic`, `-hyperliquid`); the RWA subgraph is `summer-institutions-v2-base`
  (Base only).
- `constants/networks-list.ts` — app-local `NetworkNames`/`NetworkIds` enums and
  `SDKChainIdToRpcGatewayMap` (client-side RPC via `/earn/api/rpcGateway`).
- `helpers/rpc-gateway-ssr.ts` — `SDKChainIdToSSRRpcGatewayMap` for server-side RPC; must not be
  imported in client components.
- `constants/rwa.ts` — `RWA_CLIENT_ID` and `RWA_INSTI_VERSION` used when constructing the
  institutional SDK client for RWA vault calls; `RWA_CLIENT_ID` is currently a placeholder
  (`ExtDemoCorp_v2`).
- `graphql/clients/` — auto-generated GraphQL clients for `rates`, `position-history`, and
  `rwa-vault-nav-history`; regenerate with `pnpm codegen`.

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
- **New RWA fleet:** `RWA_CLIENT_ID` in `constants/rwa.ts` is a placeholder; RWA vaults are
  currently filtered to Base (chain 8453) only in `app/server-handlers/sdk/get-rwa-vaults-list.ts`
  (and `get-rwa-vaults-info-list.ts`).
- **GraphQL codegen:** `graphql/clients/` files are generated; run `pnpm codegen` after any subgraph
  schema change. `$SUBGRAPH_BASE` must be set (via `.env` / `.env.local`) at codegen time.
- **CSS module types:** `graphql/clients/` aside, `.module.css` typings in `components/`,
  `features/`, and `app/` are also generated — run `pnpm generate-module-types` or use the watch
  mode in `dev`.
- **Env vars:** `SUBGRAPH_BASE`, `EARN_APP_URL`, `CONFIG_URL_EARN`,
  `EARN_PROTOCOL_DB_CONNECTION_STRING`, `EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING` must be
  present; wallet/auth vars (`PRIVY_*`, `INSTITUTIONS_COGNITO_*`) are also required at runtime.
