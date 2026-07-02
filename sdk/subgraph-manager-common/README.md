# @summerfi/subgraph-manager-common

Interface layer and generated GraphQL types for all Summer.fi subgraph integrations. The package
defines the manager interfaces (`IArmadaSubgraphManager`, `IDcaSubgraphManager`,
`IRwaSubgraphManager`) that subgraph manager implementations must satisfy, ships four typed GraphQL
client factories (`createProtocolGraphQLClient`, `createInstitutionsGraphQLClient`,
`createDcaGraphQLClient`, `createRwaGraphQLClient`), and re-exports the typed query result types
produced by GraphQL codegen (e.g. `GetVaultsQuery`, `Position`, `Rebalance`, `GetVaultQuery`,
`GetInstitutionsQuery`, `GetStrategiesQuery`, `GetRwaReceiptsQuery`). This is the common/interface
layer; concrete query execution lives in `subgraph-manager-service`.

## Key exports

| Export                                 | Kind       | Notes                                                                               |
| -------------------------------------- | ---------- | ----------------------------------------------------------------------------------- |
| `IArmadaSubgraphManager`               | interface  | Vaults, positions, rebalances, institutions, roles, deposits/withdrawals, staking   |
| `IDcaSubgraphManager`                  | interface  | DCA strategies and executions                                                       |
| `IRwaSubgraphManager`                  | interface  | RWA vaults, positions, rebalances, institutions                                     |
| `createProtocolGraphQLClient(url)`     | factory    | Returns a typed `getSdk` client for the protocol subgraph                           |
| `createInstitutionsGraphQLClient(url)` | factory    | Institutions subgraph                                                               |
| `createDcaGraphQLClient(url)`          | factory    | DCA subgraph                                                                        |
| `createRwaGraphQLClient(url)`          | factory    | RWA subgraph                                                                        |
| `SubgraphTypes` / `SubgraphType`       | const/type | Discriminator enum: `protocol`, `institutions`, `dca`, `rwa`                        |
| Query result types                     | types      | Re-exported from `src/generated/*/client.ts` — see `src/index.ts` for the full list |

## Build and development commands

```bash
pnpm build          # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm watch          # tsc -w
pnpm lint           # eslint .
pnpm lint:fix       # eslint . --fix

# GraphQL codegen (run after any .graphql or schema change)
pnpm generate                  # runs all four targets below
pnpm generate:protocol         # regenerates src/generated/protocol/client.ts
pnpm generate:institutions     # regenerates src/generated/institutions/client.ts
pnpm generate:dca              # regenerates src/generated/dca/client.ts
pnpm generate:rwa              # regenerates src/generated/rwa/client.ts
```

## Cross-package connections

**Consumes:** `@summerfi/sdk-common` (types used in interface signatures); GraphQL schemas fetched
from `SUBGRAPH_BASE` env var at codegen time (see `summer-protocol.yml`, `summer-institutions.yml`,
`summer-dca.yml`, `summer-rwa.yml`).

**Consumed by:** `subgraph-manager-service` (implements the interfaces), `armada-protocol-common`,
`armada-protocol-service`, `sdk-client`; also the frontend — `packages/app-types`
(`types/src/earn-protocol/index.ts` maps `Network.*` into the `SupportedSDKNetworks` enum) and
`apps/earn-protocol` (~14 files, e.g. RWA/table-data server handlers). `apps/earn-protocol-institutions`
declares it but does not import it (stale dep).

**Gotchas:**

- `src/generated/*/client.ts` files are auto-generated — never edit them by hand. After any
  `.graphql` query change or subgraph schema update, re-run `pnpm generate` (requires
  `SUBGRAPH_BASE` to be set in `../../.env`).
- The `prebuild` step that runs codegen is currently disabled (`prebuild-removed-for-now`); codegen
  must be triggered manually before building when schemas change.

SDK reference docs live in `gitbook/reference`.
