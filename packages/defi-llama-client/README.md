# @summerfi/defi-llama-client

Thin client for the [DefiLlama Yields API](https://yields.llama.fi) that wraps pool and pool-history
fetches behind a `DistributedCache` to avoid redundant network calls. It also ships a
hand-maintained map (`curatedYieldPools`) of yield-bearing token symbols to their DefiLlama pool
UUIDs (stETH, wstETH, rETH, cbETH, sDAI, weETH, sUSDe, osETH, apxETH, mevETH, woETH, bsdETH, rsETH,
rswETH, wsuperOETHb — 15 active entries).

## Key exports

| Export                                                        | Description                                                                                                                                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getCachableYieldService(cache, logger)`                      | Factory returning a `CacheableYieldsService` with `getPools()` and `getChartByPool(poolId)`. Checks `DistributedCache` before hitting the network; writes results back on miss. |
| `CacheableYieldsService`                                      | Interface for the object returned by the factory.                                                                                                                               |
| `curatedYieldPools`                                           | `{ [symbol: string]: string }` map of uppercase token symbols to DefiLlama pool UUIDs.                                                                                          |
| `Pool`, `PoolHistory`, `PoolsResponse`, `PoolHistoryResponse` | TypeScript interfaces matching the DefiLlama Yields API response shapes.                                                                                                        |

## Commands

```bash
pnpm build       # tsc -b --preserveWatchOutput -v (compiles src/ → dist/)
pnpm dev         # tsc -b --preserveWatchOutput -w
pnpm test        # jest --passWithNoTests
pnpm lint        # eslint .
pnpm lint:fix    # eslint . --fix
```

There is no `format:fix` script in this package's `package.json`.

## Cross-package connections

**Consumes**

- `@summerfi/abstractions` — provides the `DistributedCache` and `Logger` interfaces that
  `getCachableYieldService` requires as arguments. No concrete implementation is bundled; callers
  must inject one.

**Consumed by**

- `@summerfi/get-apy-function` (`summerfi-api/get-apy-function`) — the only known consumer in the
  monorepo. It calls `getCachableYieldService` and resolves pool IDs via `curatedYieldPools` to
  compute per-token APY histories.

**Gotchas**

- `curatedYieldPools` is hand-maintained. Adding support for a new yield-bearing token requires a
  manual entry with the correct DefiLlama pool UUID.
- The cache key for all pools is the fixed string `yields-pools`; the key for a single pool chart is
  `yields-chart-<poolId>`. TTL is not set inside this package — callers control expiry through their
  `DistributedCache` implementation.
- The package has no tests today (`--passWithNoTests` is required for `jest` to exit 0).
