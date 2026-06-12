# @summerfi/aave-spark-subgraph

A typed GraphQL client for the Summer.fi Aave v2/v3, Aave3, and Spark subgraphs. It queries the
`summer-oasis-history` family of subgraphs (mainnet, Base, Optimism, Arbitrum) to retrieve
historical collateral-locked positions and borrow/lend interest-rate time-series, then maps the raw
results into typed domain objects consumed by downstream serverless functions.

## Key exports

All exports come from `dist/index.js` (entry point declared in `package.json`).

| Export                                                  | Description                                                                                               |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `getAaveSparkSubgraphClient(config)`                    | Factory that returns an `AaveSparkSubgraphClient` bound to a specific `ChainId` and base URL.             |
| `AaveSparkSubgraphClient`                               | Interface with two methods: `getCollateralLocked` and `getInterestRate`.                                  |
| `GetCollateralLockedParams` / `CollateralLockedResult`  | Parameter and result types for the collateral-locked query.                                               |
| `GetInterestRateParams` / `AaveSparkInterestRateResult` | Parameter and result types for the interest-rate query (supports `AAVE_V2`, `AAVE_V3`, `AAVE3`, `SPARK`). |

## Commands

```bash
# Generate TypeScript types from schema.graphql + queries/*.graphql (must be re-run after any .graphql change)
pnpm run generate-ts-types

# Build (runs generate-ts-types automatically via prebuild)
pnpm run build

# Watch mode
pnpm run dev

# Tests
pnpm run test

# Lint
pnpm run lint
pnpm run lint:fix
```

## Cross-package connections

**Consumes**

- `@summerfi/serverless-shared` — provides `ChainId`, `ProtocolId`, and the `Address` type used
  throughout.

**Consumed by**

- `external-api/get-collateral-locked-function` — uses `getCollateralLocked`.
- `summerfi-api/get-apy-function` — uses `getInterestRate`.

**Gotchas**

- `src/types/graphql/generated.ts` is auto-generated. Run `pnpm run generate-ts-types` (or let
  `prebuild` do it) whenever `schema.graphql` or any file under `queries/` changes. The generated
  file has `// @ts-nocheck` at the top and must not be edited manually.
- The subgraph base URL is not bundled; callers must supply `urlBase` in the `SubgraphClientConfig`.
  No environment variable is read inside this package.
- Interest-rate pagination fetches up to 11 pages of 1 000 records each; if a time range produces
  more than 11 000 rate events the client throws `"Too many requests"`.
