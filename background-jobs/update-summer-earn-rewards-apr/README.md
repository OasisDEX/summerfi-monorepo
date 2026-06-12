# @summerfi/update-summer-earn-rewards-apr

AWS Lambda background job (EventBridge scheduled trigger) that periodically collects reward APRs and
base interest rates for Summer Earn Protocol vaults and writes rolling averages — hourly, daily, and
weekly — into the Summer Protocol database. On each invocation the handler iterates over active
networks (mainnet, arbitrum, base, sonic, hyperliquid), acquires a per-network advisory lock via the
`networkStatus` table, fetches supported-protocol products from the rates subgraph, calls
protocol-specific reward fetchers or external reward APIs, then upserts `rewardRate`,
`fleetInterestRate`, and the three averaging tables. Vault APRs are computed as TVL-weighted
averages across the arks that belong to each fleet vault, with reward rates sourced from the
`rewardRate` table written in the same run.

## Key entry points

- `src/index.ts` — Lambda `handler` export; also exports `updateVaultAprs`, `updateHourlyVaultApr`,
  `updateDailyVaultApr`, `updateWeeklyVaultApr`, `retrySubgraphQuery`, the `Protocol` enum, and time
  constants (`HOUR_IN_SECONDS`, `DAY_IN_SECONDS`, `WEEK_IN_SECONDS`, `EPOCH_WEEK_OFFSET`,
  `MIN_UPDATE_INTERVAL`).
- `src/rewards-service.ts` — `RewardsService` class; groups products by protocol and dispatches to
  per-protocol fetchers or external APIs (Euler, Aave Merit, Gearbox/Merkl). Applies a hard-coded
  `REWARD_RATIO_MAP` discount per token symbol (`reul` 0.50, `xsilo` 0.49, everything else 0.97).
- `src/reward-fetchers/` — `IRewardFetcher` interface plus concrete implementations:
  `MorphoRewardFetcher`, `MorphoV2RewardFetcher`, `SiloRewardFetcher`, `CompoundRewardFetcher`,
  `FluidRewardFetcher`.
- `src/scripts/backfill.ts` — one-shot historical backfill (run with `pnpm backfill`).
- `src/scripts/vaults-benchmark-backfill.ts` — vault benchmark backfill (run with
  `pnpm backfill-vaults-benchmark`).

## Build / test / dev commands

```
pnpm build                       # tsc -b --preserveWatchOutput -v
pnpm test                        # jest --passWithNoTests
pnpm lint                        # eslint .
pnpm lint:fix                    # eslint . --fix
pnpm backfill                    # tsx src/scripts/backfill.ts
pnpm backfill-vaults-benchmark   # tsx src/scripts/vaults-benchmark-backfill.ts
```

## Cross-package connections

**Consumes**

| Package                                       | What is used                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `@summerfi/summer-earn-rates-subgraph`        | `getAllClients`, `SubgraphClient`, `Products`, `Product`, `GetArksRatesQuery`, `GetProductsQuery` |
| `@summerfi/summer-earn-protocol-subgraph`     | `getAllClients`, `VaultsQuery`                                                                    |
| `@summerfi/summer-earn-institutions-subgraph` | `getAllClients`, `VaultsQuery`                                                                    |
| `@summerfi/summer-protocol-db`                | `getSummerProtocolDB`, `Network`, `Database`, `mapDbNetworkToChainId`                             |
| `@summerfi/serverless-shared`                 | `ChainId`, `NetworkByChainID`                                                                     |

**Required environment variables** (validated at Lambda startup)

| Variable                             | Purpose                                                   |
| ------------------------------------ | --------------------------------------------------------- |
| `EARN_PROTOCOL_DB_CONNECTION_STRING` | Postgres connection string for the Summer Protocol DB     |
| `SUBGRAPH_BASE`                      | Base URL passed to all subgraph client factories          |
| `NODE_ENV`                           | Must be set; used as a guard before any processing begins |

**Consumers** — no other workspace package imports this package directly; it is deployed as a
standalone Lambda.

**Gotchas**

- The `REWARD_RATIO_MAP` discounts in `RewardsService` (`reul`, `xsilo`, wildcard) are
  hand-maintained constants in `src/rewards-service.ts`; adding a new token requires a code change.
- Subgraph queries are retried up to 5 times with exponential backoff only on HTTP 429 responses;
  other errors are thrown immediately.
- The minimum update interval is 10 minutes (`MIN_UPDATE_INTERVAL`); a network is skipped if
  `lastUpdatedAt` is within that window.
- Vault APR and institutions vault APR run in separate transactions after the reward-rate
  transaction, each re-acquiring the `networkStatus` lock independently.
