# @summerfi/app-server-handlers

`@summerfi/app-server-handlers` provides Next.js server-side handler functions shared across the
Summer.fi Earn and Pro apps. It covers Armada vault data fetching (vault info, APY, historical APY),
per-ark interest rates (latest and historical), remote app-config retrieval, and a pre-configured
backend SDK instance — all intended to run exclusively in Node.js / Next.js Server Components or
Route Handlers.

## Key exports (`src/index.ts`)

| Export                                         | Source module           | Purpose                                                                                                                 |
| ---------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `getArksInterestRates`                         | `arks-interest-rates`   | Fetch latest or historical interest rates for a list of Arks on one network; falls back from batch API to per-ark calls |
| `getVaultsApy`                                 | `vaults-apy`            | Fetch current APY + 24 h/7 d/30 d SMAs for a list of fleet addresses via `FUNCTIONS_API_URL/api/vault/rates`            |
| `getVaultsHistoricalApy`                       | `vaults-historical-apy` | Historical APY series for vaults                                                                                        |
| `getVaultsInfo` / `getVaultsInfoByNetwork`     | `vaults-info`           | Armada vault metadata for all chains or one network via `backendSDK`                                                    |
| `getVaultInfo`                                 | `vault-info`            | Single-vault metadata                                                                                                   |
| `configEarnAppFetcher` / `configProAppFetcher` | `system-config`         | Fetch remote JSON app config (`CONFIG_URL_EARN` / `CONFIG_URL`)                                                         |

The package also exports sub-path entry points (`@summerfi/app-server-handlers/*`) built from
`dist/<module>/index.js`.

## Scripts

```
pnpm build      # vite build (production, watch=false)
pnpm dev        # vite build (dev mode, watch=true)
pnpm lint       # eslint
pnpm clean      # rm -rf dist
pnpm knip       # dead-export analysis
```

There is no separate test script in `package.json`.

## Cross-package connections

**Consumes:**

- `@summerfi/app-types` _(devDependency)_ — `SupportedSDKNetworks`, `SupportedNetworkIds`, and all
  param/response types
- `@summerfi/app-utils` _(peerDependency)_ — `getArkProductId`, `getArkRatesBatchUrl`,
  `subgraphNetworkToId`, `serverOnlyErrorHandler`
- `@summerfi/sdk-client` _(peerDependency)_ — `makeSDK` / `SDKManager` (instantiated in
  `sdk/sdk-backend-client.ts`)
- `@summerfi/sdk-common` _(peerDependency)_ — `IArmadaVaultInfo`, `getChainInfoByChainId`
- `@summerfi/summer-earn-rates-subgraph` _(peerDependency)_ — `GetInterestRatesQuery` type (used in
  `constants.ts`)
- `graphql-request` _(peerDependency)_ — `GraphQLClient` used by the per-chain rates map in
  `arks-interest-rates/constants.ts`

**Who consumes this package:** Next.js app packages in the monorepo (Earn app, Pro app) import
handler functions as Next.js Server Actions (`'use server'`) or inside Route Handlers.

**Required environment variables:**

| Variable                        | Used by                                                                     |
| ------------------------------- | --------------------------------------------------------------------------- |
| `SUBGRAPH_BASE`                 | `arks-interest-rates/constants.ts` — base URL for per-chain rates subgraphs |
| `FUNCTIONS_API_URL`             | `getArksInterestRates`, `getVaultsApy` — batch/individual rates API         |
| `SDK_API_URL`                   | `sdk/sdk-backend-client.ts` — backend SDK tRPC endpoint                     |
| `CONFIG_URL_EARN`               | `configEarnAppFetcher`                                                      |
| `CONFIG_URL`                    | `configProAppFetcher`                                                       |

**Adding a new chain:** Add a `GraphQLClient` entry to the `graphqlClients` map in
`src/arks-interest-rates/constants.ts` keyed by the new `SupportedSDKNetworks` value and pointing to
`${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-<chain>`. The map is typed
`[key in SupportedSDKNetworks]`, so omitting the entry is a compile error. `getVaultsInfo` and
`getVaultsApy` require no edits — they iterate `Object.values(SupportedNetworkIds)` automatically.
