# update-beach-club-rewards-function

`@summer-earn/beach-club-processor` is an AWS Lambda background job (EventBridge scheduled trigger)
that processes Beach Club referral rewards. On each invocation it determines the time window since
the last checkpoint, fetches referred accounts and position snapshots from Summer Protocol subgraphs
across all supported chains (mainnet, arbitrum, base, sonic, hyperliquid), calculates fee-based
rewards (stable and volatile fee rates per referral code type), and persists the results to a
PostgreSQL database via Kysely. Processing is chunked into 1-hour windows with a maximum catch-up
window of 10 days per run, and a `points_config.is_updating` flag prevents concurrent runs.

## Key entry points

| File                 | Purpose                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| `src/index.ts`       | Lambda `handler` export — EventBridge scheduled event entry point       |
| `src/entry-point.ts` | CLI runner (`pnpm execute`) for local / manual invocations              |
| `src/processor.ts`   | `ReferralProcessor` — core orchestration logic                          |
| `src/client.ts`      | `ReferralClient` — GraphQL subgraph queries across all chains           |
| `src/db.ts`          | `DatabaseService` — Kysely database operations                          |
| `src/config.ts`      | `ConfigService` — runtime config reads/writes via `points_config` table |

## Build / test / dev commands

```bash
# Compile TypeScript (runs graphql-codegen first via prebuild)
pnpm build

# Watch mode
pnpm dev

# Re-run GraphQL codegen only (required after changing src/graphql/operations.ts)
pnpm codegen

# Start the compiled Lambda entry point
pnpm start

# Process the latest period from CLI
pnpm execute

# Dry run (no writes)
pnpm dry-run

# Tests
pnpm test
pnpm test:watch
```

## Cross-package connections

**Consumes:**

- `@summerfi/summer-beach-club-db` (workspace: `packages/summer-beach-club-db`) — provides the
  Kysely `DB` type and all migration/schema definitions; schema changes there require rebuilding
  this package.

**Consumed by:** nothing in the monorepo at build time; deployed as a standalone Lambda image (see
`Dockerfile`).

**Environment variables:**

```bash
# Required
BEACH_CLUB_REWARDS_DB_CONNECTION_STRING=postgres://user:pass@host:port/db

# Optional — override default staging subgraph URLs baked into src/client.ts
ETHEREUM_SUBGRAPH_URL=...
ARBITRUM_SUBGRAPH_URL=...
BASE_SUBGRAPH_URL=...
SONIC_SUBGRAPH_URL=...
HYPERLIQUID_SUBGRAPH_URL=...
```

**Codegen gotcha:** `src/generated/graphql.ts` is produced by `graphql-codegen` using
`codegen.yaml`. The schema is fetched from the remote staging subgraph URLs listed in
`codegen.yaml`; `src/graphql/operations.ts` contains the GraphQL query documents (matched by the
`documents: 'src/**/*.ts'` glob). After changing any GraphQL operation, run `pnpm codegen` (or
`pnpm build`, which runs it via `prebuild`) before compiling or running tests.
