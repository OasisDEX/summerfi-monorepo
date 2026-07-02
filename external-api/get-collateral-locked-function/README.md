# @summerfi/get-collateral-locked-function

AWS Lambda function (API Gateway v2) that aggregates weETH/eETH collateral locked across Aave/Spark,
Ajna, and Morpho Blue subgraphs for a given chain and block number. It fans out parallel subgraph
queries, merges results by owner address, and returns per-address `effective_balance` values plus a
total TVL figure. Morpho Blue queries are only issued for Mainnet and Base. The function is deployed
via AWS Lambda Powertools (logger, metrics, tracer) and is part of the Summer.fi external-api
surface.

## Key exports / entry points

- `src/index.ts` — sole entry point; exports `handler` (the Lambda handler) and `addressesSchema` (a
  Zod schema for comma-separated address query params).
- Query parameters accepted by `handler`: `chainId` (required), `blockNumber` (required), `address`
  (optional, comma-separated list to filter results).
- Response shape: `{ Result: [{ address, effective_balance }], TVL: number }`.

## Commands

```bash
pnpm build      # tsc -b --preserveWatchOutput -v
pnpm watch      # tsc -w
pnpm test       # jest --passWithNoTests
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

## Cross-package connections

**Consumes:**

- `@summerfi/aave-spark-subgraph` — `getAaveSparkSubgraphClient`, `CollateralLocked`,
  `CollateralLockedResult`
- `@summerfi/ajna-subgraph` — `getAjnaSubgraphClient`
- `@summerfi/morpho-blue-subgraph` — `getMorphoBlueSubgraphClient`
- `@summerfi/serverless-shared` — `ResponseOk`, `ResponseBadRequest`, `ResponseInternalServerError`,
  `chainIdSchema`, `Address`, `ChainId`, `isValidAddress`

**Consumed by:** no packages in the monorepo import this package directly; it is invoked as a
deployed Lambda endpoint.

**Gotchas:**

- `SUBGRAPH_BASE` environment variable must be set at runtime; the handler returns HTTP 500 and
  exits early if it is absent.
- Ajna and Morpho Blue results are manually shifted by `-18` decimals inside this handler before
  aggregation; Aave/Spark results are not — verify that upstream subgraph clients do not
  double-apply decimal conversion if those clients change.
- The weETH/eETH address map (`weETH_eETH_map`) is hand-maintained in `src/index.ts`; adding support
  for a new chain requires updating that map as well as `ChainId` in `@summerfi/serverless-shared`.
- Morpho Blue is only queried for `ChainId.MAINNET` and `ChainId.BASE`; other chains silently skip
  it.
