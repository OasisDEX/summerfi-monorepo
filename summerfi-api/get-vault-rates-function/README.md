# @summerfi/get-vault-rates-function

AWS Lambda function (SST v2, Node.js 20, ESM) that serves vault interest-rate data from the Summer
Protocol database. It handles two POST routes — `POST /api/vault/rates` (latest rates plus 24 h / 7
d / 30 d SMAs) and `POST /api/vault/historicalRates` (hourly, daily, weekly, and latest-rate series)
— for one or more fleet addresses identified by `{ chainId, fleetAddress }` pairs.

## Key entry points

| File                | Role                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/index.ts`      | Lambda `handler` export; parses the request body and routes to the correct `VaultRatesService` method |
| `src/db-service.ts` | `VaultRatesService` class — `init()`, `getLatestRates()`, `getHistoricalRates()`, `destroy()`         |

## Scripts

```
pnpm typecheck   # tsc -noEmit (only script defined in package.json)
```

There is no build, bundle, or test script in this package's `package.json`. Bundling is handled by
SST at deploy time via the stack definition in `stacks/apy.ts`.

## Cross-package connections

**Consumes**

- `@summerfi/summer-protocol-db` — `getSummerProtocolDB`, `mapChainIdToDbNetwork`,
  `SummerProtocolDB`, `PgSummerProtocolDbConfig`; tables queried: `fleetInterestRate`,
  `hourlyFleetInterestRate`, `dailyFleetInterestRate`, `weeklyFleetInterestRate`
- `@summerfi/app-types` — `HistoricalFleetRateResult`, `FleetRate` (dev dependency used only for
  types)
- `@aws-lambda-powertools/logger` — structured Lambda logging

**Consumed by**

- `stacks/apy.ts` — registers the handler at
  `summerfi-api/get-vault-rates-function/src/index.handler` and attaches it to
  `POST /api/vault/rates` and `POST /api/vault/historicalRates` via the SST API construct

**Required environment variable**

- `EARN_PROTOCOL_DB_CONNECTION_STRING` — Postgres connection string; the function throws at startup
  if this is absent. Injected by `stacks/apy.ts` from the deployment environment.

**Gotchas**

- The package has no `exports` or `main` field; it is not meant to be imported by other packages —
  it is a Lambda entry-point only.
- DB pool is capped at `max: 1` connection to stay within Lambda concurrency constraints; the
  `destroy()` call in the `finally` block tears it down after every invocation.
- Route dispatch is path-based (`event.requestContext.http.path`) inside a single handler, so both
  POST routes share the same cold-start cost.
