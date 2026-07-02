# @summerfi/morpho-blue-subgraph

A typed GraphQL client for the Summer.fi Morpho Blue subgraphs. It exposes two queries — collateral
locked at a block and borrow/lend interest rates over a time range — against the
`summer-morpho-blue` (Mainnet) and `summer-morpho-blue-base` (Base) subgraph deployments. The single
public factory `getMorphoBlueSubgraphClient(config)` returns a bound client whose `chainId` must be
one of those two chains; any other value throws at runtime.

## Key exports (`src/index.ts`)

| Export                                                         | Description                                                             |
| -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `getMorphoBlueSubgraphClient(config)`                          | Factory; returns `MorphoBlueSubgraphClient` bound to a chain + base URL |
| `MorphoBlueSubgraphClient`                                     | Interface with `getCollateralLocked` and `getInterestRate` methods      |
| `GetCollateralLockedParams` / `CollateralLockedResult`         | Input/output types for the collateral query                             |
| `GetInterestRateParams` / `MorphoBlueMarketInterestRateResult` | Input/output types for the interest-rate query                          |

Generated GraphQL types live in `src/types/graphql/generated.ts` (auto-generated, not hand-edited).

## Scripts

```
pnpm build              # runs generate-ts-types then tsc -b --preserveWatchOutput -v
pnpm generate-ts-types  # graphql-codegen --config graphql.config.yml → src/types/graphql/generated.ts
pnpm dev                # tsc -b --preserveWatchOutput -w
pnpm test               # jest --passWithNoTests
pnpm lint / lint:fix    # eslint
```

`build` runs `prebuild` automatically, which calls `generate-ts-types`. If you add or modify a
`.graphql` file in `queries/` or change `schema.graphql`, re-run `pnpm generate-ts-types` before
building.

## Cross-package connections

**Consumes**

- `@summerfi/serverless-shared` (workspace) — `Address`, `Token`, `ChainId` types used throughout
  the client.
- `graphql-request` — executes all subgraph HTTP requests.
- `@aws-lambda-powertools/logger` — optional `Logger` accepted in `SubgraphClientConfig`.

**Consumed by**

- `external-api/get-collateral-locked-function` — calls `getCollateralLocked`.
- `summerfi-api/get-apy-function` — calls `getInterestRate`.

**Gotchas**

- The subgraph base URL (`urlBase`) is injected at call-site; there is no env-var fallback inside
  the package itself — callers must supply it.
- `src/types/graphql/generated.ts` is auto-generated and **not committed** (covered by the root
  `.gitignore` pattern `/**/types/graphql/*.ts`); it must be generated before the first build and
  regenerated whenever `schema.graphql` or any file under `queries/` changes, or TypeScript
  compilation will fail. The `prebuild` hook runs `generate-ts-types` automatically on every build.
- Pagination in `getInterestRates` fetches 1 000 records per page; after 11 pages total (1 initial +
  10 additional), the next loop iteration throws `'Too many requests'`.
