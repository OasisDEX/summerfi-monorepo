# @summerfi/get-rates-function

AWS Lambda function (SST v2, `@middy/core` wrapper) that serves APY and historical rate data for the
Summer.fi Earn protocol. For each request it fetches on-chain base rates from the
`@summerfi/summer-earn-rates-subgraph` GraphQL client and reward rates from a PostgreSQL database
via `@summerfi/summer-protocol-db`, combines them, and caches the result in Redis via
`@summerfi/redis-cache`.

## Key entry points

- `src/index.ts` — Lambda handler (`handler` export), three routes:
  - `GET /api/rates/{chainId}?productId=` — latest combined rates for one product (up to 20 entries)
  - `GET /api/historicalRates/{chainId}?productId=` — daily (365), hourly (720), weekly (156) +
    latest rate
  - `POST /api/rates` body `{ productIds: string[] }` — batch latest rates across chains
- `src/db-service.ts` — `RatesService` class: `initIfNeeded()`, `getLatestRates()`,
  `getLatestRatesBatch()`, `getHistoricalRates()`, `getFleetRates()`, `destroy()`

Rate combination logic: subgraph base rate + DB reward rate. For latest rates, DB entries are
matched within a 1-hour window of the subgraph timestamp.

## Commands

```bash
pnpm typecheck   # tsc -noEmit (only script defined in package.json)
```

There are no `build`, `test`, or `dev` scripts in this package's `package.json`.

## Environment variables

| Variable                             | Required | Purpose                                                |
| ------------------------------------ | -------- | ------------------------------------------------------ |
| `EARN_PROTOCOL_DB_CONNECTION_STRING` | yes      | PostgreSQL connection string                           |
| `SUBGRAPH_BASE`                      | yes      | Base URL for subgraph clients                          |
| `STAGE`                              | yes      | Deployment stage (also used as Redis key namespace)    |
| `REDIS_CACHE_URL`                    | no       | Redis endpoint; omitting disables caching (noop cache) |
| `REDIS_CACHE_USER`                   | no       | Redis username                                         |
| `REDIS_CACHE_PASSWORD`               | no       | Redis password                                         |

## Cross-package connections

**Consumes**

- `@summerfi/summer-earn-rates-subgraph` — `getAllClients()`, `GetArkRates`, `GetArksRates`,
  `GetInterestRates` queries; one client per `chainId`
- `@summerfi/summer-protocol-db` — `getSummerProtocolDB`, `mapChainIdToDbNetwork`; tables:
  `rewardRate`, `dailyRewardRate`, `hourlyRewardRate`, `weeklyRewardRate`, `fleetInterestRate`
- `@summerfi/redis-cache` — `getRedisInstance()` for `DistributedCache`
- `@summerfi/abstractions` — `DistributedCache` interface

**Consumed by**

No other workspace package imports this package directly; it is deployed as a standalone Lambda
function.

**Gotchas**

- `STAGE` is mandatory even when Redis is not configured; the handler returns HTTP 500 if it is
  absent.
- The DB connection is torn down in the `finally` block of every invocation
  (`ratesService.destroy()`), so the pool max is set to 1.
- Subgraph queries use exponential-backoff retry (`retrySubgraphQuery` function default is 5
  retries, but all call sites in this handler explicitly pass `retries: 3`) only for HTTP 429
  errors; other errors propagate immediately.
- The `weeklyRewardRate` table uses a `weekTimestamp` column aliased as `date`; the join key for
  `combineRatesById` relies on this alias being consistent.
