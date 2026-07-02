# @summerfi/automation-subgraph

Typed GraphQL client for the Summer.fi automation subgraphs. It exposes a thin
`AutomationSubgraphClient` that executes `Triggers` and `OneTrigger` queries against chain-specific
subgraph endpoints (Mainnet, Base, Optimism, Arbitrum) and returns strongly-typed results generated
from `schema.graphql` and the `.graphql` query files under `queries/`.

## Key exports

| Export                                | Description                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `getAutomationSubgraphClient(config)` | Factory that returns an `AutomationSubgraphClient` bound to a specific `chainId` and `urlBase` |
| `AutomationSubgraphClient`            | Interface with `getTriggers(params)`                                                           |
| `GetTriggersParams`                   | `{ account: string; poolId?: string }`                                                         |
| `GetOneTriggerParams`                 | `{ triggerId: string }`                                                                        |
| `OneTrigger`                          | Alias for the non-null trigger shape returned by the `OneTrigger` query                        |
| `TriggersQuery`                       | Re-exported generated type for the `Triggers` query result                                     |

The generated types live in `src/types/graphql/generated.ts` — do **not** edit this file; it is
overwritten by codegen.

## Commands

```bash
# Generate TypeScript types from schema + queries (runs automatically before build)
pnpm generate-ts-types

# Compile
pnpm build

# Watch mode
pnpm dev

# Tests (no test files currently; passes with --passWithNoTests)
pnpm test

# Lint
pnpm lint
pnpm lint:fix
```

## Cross-package connections

**Consumes**

- `@summerfi/serverless-shared` — provides the `ChainId` enum used to select the correct subgraph
  endpoint.
- `graphql-request` — HTTP transport for all queries.
- `@graphql-codegen/cli` and plugins (root workspace devDependencies) — generate
  `src/types/graphql/generated.ts` from `schema.graphql` and the files in `queries/`. These are not
  listed in this package's own `devDependencies`; they are hoisted from the monorepo root.

**Consumed by**

- `summerfi-api/get-triggers-function` — the only known consumer; it calls
  `getAutomationSubgraphClient` and reads `TriggersQuery` types to build its Lambda response.

**Gotchas**

- `pnpm generate-ts-types` (or `pnpm build`, which runs it via `prebuild`) must be re-run whenever
  `schema.graphql` or any file under `queries/` changes; otherwise the TypeScript types will be
  stale.
- Supported chains are hard-coded in `chainIdSubgraphMap`; passing an unsupported `ChainId` throws
  at runtime.
- The caller must supply `urlBase` — no default URL is baked into the package.
