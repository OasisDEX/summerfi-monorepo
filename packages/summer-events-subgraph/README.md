# @summerfi/summer-events-subgraph

Typed GraphQL client for querying the Summer Events subgraph. It exposes a single
`getSummerPointsSubgraphClient` factory that returns a client with a `getUsersPoints` method, which
paginates through all users (cursor-based, 1 000 per page) across four supported chains: Mainnet,
Base, Optimism, and Arbitrum.

## Key exports

| Export                                                                                        | Description                                                       |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `getSummerPointsSubgraphClient(config)`                                                       | Factory — returns `SummerPointsSubgraphClient`                    |
| `SummerPointsSubgraphClient`                                                                  | Interface with `getUsersPoints(params)`                           |
| `GetUsersPointsParams`                                                                        | `{ startTimestamp: number, endTimestamp: number }` (Unix seconds) |
| `User`, `Position`, `MigrationEvent`, `RecentSwapInPosition`, `RecentSwapInUser`, `UsersData` | Shape types derived from the generated `SummerPointsQuery`        |
| `START_POINTS_TIMESTAMP`                                                                      | `1718701200` — production epoch (2024-06-18 UTC)                  |
| `STAGING_START_POINTS_TIMESTAMP`                                                              | `1718366400` — staging epoch (2024-06-14 UTC)                     |

The only query is `SummerPoints` (`queries/get-points.graphql`); it fetches positions, swap history,
migration events, and active triggers for every user.

## Build / dev / test commands

```bash
# Type-generate src/types/graphql/generated.ts from schema.graphql + queries/**/*.graphql
pnpm run generate-ts-types   # graphql-codegen --config graphql.config.yml

# Full build (runs prebuild → generate-ts-types, then tsc)
pnpm run build

# Watch mode
pnpm run dev

# Tests (pass-through when none exist)
pnpm test

# Lint
pnpm run lint
pnpm run lint:fix
```

`prebuild` calls `generate-ts-types` automatically, so `pnpm build` is enough after editing
`schema.graphql` or any `.graphql` file under `queries/`.

## Cross-package connections

**Consumes**

| Package                       | Why                                                   |
| ----------------------------- | ----------------------------------------------------- |
| `@summerfi/serverless-shared` | `ChainId` enum used for the chain → subgraph-name map |
| `@summerfi/abstractions`      | `Logger` type on `SubgraphClientConfig`               |
| `graphql-request`             | HTTP transport for all subgraph queries               |

**Consumed by**

No other package in this monorepo currently declares a dependency on
`@summerfi/summer-events-subgraph`.

**Gotchas**

- `src/types/graphql/generated.ts` is auto-generated and tracked in `.gitignore` patterns — run
  `pnpm run generate-ts-types` (or `pnpm build`) before first use or after changing any `.graphql`
  file; without it the TypeScript build will fail.
- The `urlBase` passed to `getSummerPointsSubgraphClient` must not include a trailing subgraph name
  — the client appends `/summer-events[-<chain>]` itself.
- Only Mainnet, Base, Optimism, and Arbitrum are mapped; any other `ChainId` throws at runtime.
