# @summerfi/prices-subgraph

GraphQL client for the Summer.fi prices subgraph. Provides typed query functions that fetch on-chain
derived token prices (latest price, max price since a block, price by Chainlink round IDs, and
USDC/token price pairs) across Mainnet, Arbitrum, Optimism, and Base. TypeScript types for all
queries are generated from `schema.graphql` and the files under `queries/` via `graphql-codegen`;
the output lands in `src/types/graphql/generated.ts` and must be regenerated whenever the schema or
queries change.

## Key exports (`src/index.ts`)

| Export                               | Description                                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `getPricesSubgraphClient(config)`    | Factory that returns a `PricesSubgraphClient` bound to a chain and base URL                           |
| `PricesSubgraphClient`               | Interface with `getLatestPrice`, `getMaxPrice`, `getPriceByRoundIds`, `getUsdcAndTokenPrice`          |
| `DerivedPrices`, `UsdcAndTokenPrice` | Response-shape types used by callers                                                                  |
| Param interfaces                     | `GetLatestPriceParams`, `GetMaxPriceParams`, `GetPriceByRoundIdsParams`, `GetUsdcAndTokenPriceParams` |

## Scripts

```
pnpm generate-ts-types   # run graphql-codegen (also runs automatically as prebuild)
pnpm build               # generate-ts-types then tsc -b --preserveWatchOutput -v
pnpm dev                 # tsc -b --preserveWatchOutput -w
pnpm test                # jest --passWithNoTests
pnpm lint / lint:fix     # eslint
```

## Cross-package connections

**Consumes**

- `@summerfi/serverless-shared` (workspace) — `Address` and `ChainId` domain types used in all
  public param/return interfaces.

**Consumed by**

- `packages/triggers-calculations` — uses the client to fetch prices during trigger calculations.
- `summerfi-api/get-triggers-function` — Lambda handler that queries prices at runtime.
- `summerfi-api/setup-trigger-function` — Lambda handler that uses prices during trigger setup.

**Gotchas**

- `src/types/graphql/generated.ts` is auto-generated and must **not** be edited by hand. Re-run
  `pnpm generate-ts-types` after any change to `schema.graphql` or any file under `queries/`.
- `getPricesSubgraphClient` requires a `urlBase` string at call-time (no default); callers are
  responsible for supplying the correct subgraph gateway URL (typically from an environment
  variable).
- Only four chains are mapped (`MAINNET`, `ARBITRUM`, `OPTIMISM`, `BASE`); passing any other
  `ChainId` throws at runtime.
