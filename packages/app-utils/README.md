# @summerfi/app-utils

Shared utility library for the Summer.fi earn-protocol apps. It provides number/time constants,
display formatters, chain/network mapping helpers, ark-rate URL builders, localStorage config
helpers, and small server-side utilities used across the monorepo.

## Key exports / entry points

All exports come from the single root entry point (`@summerfi/app-utils`).

| Group                 | Notable exports                                                                                                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Network tools         | `isSupportedSDKChain`, `sdkNetworkToHumanNetwork`, `humanNetworktoSDKNetwork`, `humanReadableChainToLabelMap`, `chainIdToSDKNetwork`, `sdkNetworkToChain`, `mapDbNetworkToChainId`, `mapChainIdToDbNetwork`, `HumanReadableNetwork`                  |
| Ark rates URLs        | `getArkRatesUrl` → `${apiUrl}/api/rates/<chainId>`; `getArkHistoricalRatesUrl` → `${apiUrl}/api/historicalRates/<chainId>` (both keyed by `SupportedSDKNetworks`); `getArkRatesBatchUrl` → `${apiUrl}/api/rates` (no chainId, single batch endpoint) |
| Formatters            | `formatCryptoBalance`, `formatFiatBalance`, `formatPercent`, `formatAsShorthandNumbers`, `formatAddress`, `formatToBigNumber`, `cleanAmount`                                                                                                         |
| Config (localStorage) | `loadConfigFromLocalStorage`, `saveConfigToLocalStorage`, `getLocalAppConfig`, `updateConfigOverrides` (keys: `ob-config`, `ob-config-overrides`)                                                                                                    |
| Ark helpers           | `decorateWithFleetConfig`, `getArkProductId`, `getArksWeightedApy`, `aggregateArksPerNetwork`                                                                                                                                                        |
| Misc                  | `ADDRESS_ZERO`, `isSupportedHumanNetwork`, `verifyAccessToken`, `serverOnlyErrorHandler`, `slugify`                                                                                                                                                  |

## Build / dev commands

```
pnpm build   # vite build (prod); note: prebuild script runs the same command first, so two vite build invocations total
pnpm dev     # vite build --watch (dev mode)
pnpm lint    # eslint *.ts*
pnpm clean   # rm -rf dist
pnpm knip    # unused-export analysis
```

There is no test script in `package.json`.

## Cross-package connections

**Consumes:**

- `@summerfi/app-types` (dev dep) — `SupportedNetworkIds`, `SupportedSDKNetworks`, `NetworkNames`,
  `NetworkIds`, `EarnProtocolDbNetwork`, `AppConfigType`, `emptyConfig`
- `viem/chains` (peer) — `arbitrum`, `base`, `hyperliquid`, `mainnet`, `sonic` imported directly in
  `earn-network-tools.ts`
- `lodash-es`, `bignumber.js`, `dayjs`, `jose`, `next` (peers)

**Consumed by (workspace):**

- `@summerfi/app-earn-ui`, `@summerfi/app-risk`, `@summerfi/app-server-handlers`,
  `@summerfi/app-tos` (`@summerfi/ssr-public-client` declares the dep in `package.json` but no
  longer imports it — stale)
- Apps: `earn-protocol`, `earn-protocol-landing-page`, `earn-protocol-institutions`

**Gotchas:**

- **Adding a new chain** requires edits in two hand-maintained files:
  `src/helpers/earn-network-tools.ts` (update `humanReadableNetworkMap`,
  `humanReadableChainToLabelMap`, `sdkNetworkMap`, `sdkNetworkToChain` chain map,
  `dbNetworkToChainId`, and all per-network lookup objects) and `src/helpers/get-arks-rates-url.ts`
  (add the new network entry to the three URL builder maps).
- The `viem` chain import (`hyperliquid`, `sonic`, etc.) must exist in the installed version of
  `viem` (peer `2.47.1`); adding a chain not yet exported by viem requires a viem upgrade or a local
  shim.
- `access-config-context.ts` is marked `'use client'` — importing it in a server-only module will
  cause a Next.js build error.
- No codegen steps; all mappings are hand-written.
