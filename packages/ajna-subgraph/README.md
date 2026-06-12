# @summerfi/ajna-subgraph

Typed GraphQL client for the Summer.fi Ajna protocol subgraphs. It exposes a single factory function
— `getAjnaSubgraphClient` — that returns a client bound to a specific chain and subgraph base URL,
capable of querying borrow/lend interest rates and locked collateral positions across Mainnet, Base,
Optimism, and Arbitrum. All GraphQL types in `src/types/graphql/generated.ts` are code-generated
from `schema.graphql` and the query files under `queries/`; that file must be regenerated whenever
either changes.

## Key exports (`src/index.ts`)

| Export                                                                | Description                                                             |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `getAjnaSubgraphClient(config)`                                       | Factory — returns `AjnaSubgraphClient` bound to a `chainId` + `urlBase` |
| `AjnaSubgraphClient`                                                  | Interface with `getCollateralLocked` and `getInterestRate` methods      |
| `GetCollateralLockedParams`, `CollateralLockedResult`                 | Types for the collateral query                                          |
| `GetInterestRateParams`, `AjnaPoolInterestRateResult`, `InterestRate` | Types for the interest-rate query                                       |

## Scripts

```
pnpm build          # prebuild runs generate-ts-types, then tsc -b --preserveWatchOutput -v
pnpm dev            # tsc -b --preserveWatchOutput -w
pnpm generate-ts-types  # graphql-codegen --config graphql.config.yml (must re-run after schema/query changes)
pnpm test           # jest --passWithNoTests
pnpm lint           # eslint .
pnpm lint:fix       # eslint . --fix
```

## Cross-package connections

**Consumes**

- `@summerfi/serverless-shared` (workspace) — provides `Address`, `Token`, `ChainId`

**Consumed by**

- `external-api/get-collateral-locked-function` — uses `getCollateralLocked`
- `summerfi-api/get-apy-function` — uses `getInterestRate`

**Gotchas**

- `src/types/graphql/generated.ts` is auto-generated and checked in. After any change to
  `schema.graphql` or files under `queries/`, run `pnpm generate-ts-types` before building or the
  build will fail with stale types.
- The subgraph base URL (`urlBase`) is caller-supplied at runtime; no env var is read inside this
  package.
- Only four chains are mapped (`MAINNET`, `BASE`, `OPTIMISM`, `ARBITRUM`); passing any other
  `ChainId` throws at runtime.
- Interest-rate pagination caps at 10 additional paginated requests after the initial fetch (11
  total fetches, up to 11 000 records); queries spanning very long time windows may hit this limit
  and throw.
