# @summerfi/summer-earn-rates-subgraph

GraphQL client package for the Summer Earn Protocol rates subgraphs. It wraps `graphql-request` with
codegen-generated typed SDK methods and exposes per-chain clients for querying interest rates and
product data across the five supported networks: Mainnet, Base, Arbitrum, Sonic, and Hyperliquid.

## Key exports

| Export                                                                   | Description                                                                                         |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `getAllClients(baseUrl)`                                                 | Returns a `Record<ChainId, SubgraphClient>` for all supported chains at once                        |
| `GetInterestRatesDocument`                                               | Pre-built GraphQL document for the `GetInterestRates` query (re-exported from the generated client) |
| `SubgraphClient`, `InterestRate`, `Products`, `LatestInterestRate`, etc. | TypeScript types derived from the generated schema                                                  |

> **Note:** `createClient` is an internal helper used by `getAllClients`; it is not exported from
> the package's public `index.ts`.

The generated file `src/generated/client.ts` is produced by `graphql-codegen` and must not be edited
by hand.

## Scripts

```
pnpm generate   # run graphql-codegen (requires SUBGRAPH_BASE env var; reads ../../.env via dotenv)
pnpm build      # tsc -b --preserveWatchOutput -v tsconfig.build.json → dist/
pnpm dev        # tsc -b --preserveWatchOutput -v -w tsconfig.build.json (watch mode)
pnpm test       # jest --passWithNoTests
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

## Cross-package connections

**Consumes**

- `@summerfi/serverless-shared` — imports `ChainId` enum used throughout the client factory and
  chain map.

**Consumed by**

- `@summerfi/app-earn-ui`
- `@summerfi/app-server-handlers`
- `@summerfi/app-types`

**Gotchas**

- `pnpm generate` requires `SUBGRAPH_BASE` to be set (the base URL of the subgraph gateway). The
  script sources it from the root `.env` file (`../../.env` relative to this package) via
  `dotenv/config`.
- The codegen target schema is hardcoded to the Hyperliquid subgraph name in `codegen.yml`; this
  only affects schema introspection during codegen — runtime routing is handled by
  `subgraphNameByChainMap`.
- The supported-chain list is derived at runtime from the keys of `subgraphNameByChainMap` in
  `src/utils/subgraphNameByChainMap.ts`; adding a new chain requires updating that map and
  re-running `pnpm generate` if the schema changes.
- `src/generated/client.ts` is committed but is a generated artefact — regenerate it after any
  `.graphql` query change or subgraph schema update.
