# @summerfi/get-apy-function

AWS Lambda handler that computes leveraged position APY for Aave v2/v3, Spark, Ajna, and Morpho
Blue. Given a protocol, chain, position parameters (collateral/debt addresses or pool/market ID,
LTV, reference date), it fetches historical interest-rate data from the relevant subgraph,
optionally overlays DeFi Llama token yield data, then rolls up a multiply-adjusted APY across 1d /
7d / 30d / 90d / 365d windows. Results are cached in Redis for up to 6 hours to reduce subgraph
load.

## Key exports / entry points

| Symbol                            | File                                | Purpose                                                                        |
| --------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| `handler`                         | `src/index.ts`                      | AWS Lambda entry point (`APIGatewayProxyEventV2`)                              |
| `getFinalApy`                     | `src/final-apy-calculation.ts`      | Core APY arithmetic (multiply, windowed averages)                              |
| `getUnifiedProtocolRates`         | `src/get-unified-protocol-rates.ts` | Protocol dispatch — fetches subgraph data for Aave/Spark, Ajna, or Morpho Blue |
| `ApyResponse`, `pathParamsSchema` | `src/contracts.ts`                  | Zod schemas and response type shared by handler                                |

## Build / test / dev commands

```
pnpm build   # tsc -b --preserveWatchOutput -v
pnpm test    # jest --passWithNoTests
pnpm lint    # eslint .
pnpm lint:fix
```

No `dev` or `start` script — this package is deployed as a Lambda function, not run locally as a
server.

## Cross-package connections

**Consumes (workspace dependencies):**

- `@summerfi/serverless-shared` — shared Zod schemas (`chainIdSchema`, `protocolIdSchema`,
  `ltvSchema`, `addressSchema`) and HTTP response helpers (`ResponseOk`, `ResponseBadRequest`,
  `ResponseInternalServerError`)
- `@summerfi/aave-spark-subgraph` — `getAaveSparkSubgraphClient` / `AaveSparkInterestRateResult`
- `@summerfi/ajna-subgraph` — `getAjnaSubgraphClient` / `AjnaPoolInterestRateResult`
- `@summerfi/morpho-blue-subgraph` — `getMorphoBlueSubgraphClient` /
  `MorphoBlueMarketInterestRateResult`
- `@summerfi/redis-cache` — `getRedisInstance` for the `DistributedCache` implementation
- `@summerfi/defi-llama-client` — `getCachableYieldService` for token-level yield data
- `@summerfi/abstractions` — `DistributedCache` interface (used as a no-op fallback when Redis is
  absent)

**Consumed by:** no other workspace package imports this package — it is a standalone Lambda
deployment artifact.

**Required environment variables (handler will return 500 if missing):**

| Variable               | Required | Notes                                                  |
| ---------------------- | -------- | ------------------------------------------------------ |
| `RPC_GATEWAY`          | yes      | EVM RPC endpoint base URL                              |
| `SUBGRAPH_BASE`        | yes      | Base URL for subgraph clients                          |
| `STAGE`                | yes      | Deployment stage passed to Redis cache key namespacing |
| `REDIS_CACHE_URL`      | no       | If absent, caching is silently skipped                 |
| `REDIS_CACHE_USER`     | no       | Redis auth username                                    |
| `REDIS_CACHE_PASSWORD` | no       | Redis auth password                                    |

**Gotchas:**

- Morpho Blue subgraph queries are only supported on `ChainId.MAINNET` and `ChainId.BASE`; other
  chains return a 400 error.
- `apy30d`, `apy90d`, and `apy365d` return `null` (not a number) when fewer than the required number
  of daily data points are present — callers must handle `null`.
- Redis TTL is hard-coded to 6 hours (`ONE_HOUR * 6`); there is no per-request override.
