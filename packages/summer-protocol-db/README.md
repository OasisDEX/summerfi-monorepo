# @summerfi/summer-protocol-db

Kysely-backed Postgres client for the Summer Protocol database. Exports `getSummerProtocolDB`
(returns `Promise<{ db: Kysely<Database> }>` with `CamelCasePlugin` applied), the auto-generated
`Database` type from `database-types.ts`, and `DbNetworks` / `mapDbNetworkToChainId` /
`mapChainIdToDbNetwork` helpers.

**Used by:** `apps/earn-protocol` (server handlers, API routes) and `@summerfi/app-types`.

**Migrations** live in `src/migrations/` as numbered `.mts` files (currently 001–019). Run them
locally with `pnpm migrate:latest` / `migrate:up` / `migrate:down`.

**Adding a chain:** extend `DbNetworks` and `dbNetworkToChainId` in `src/helpers.ts`, add a Kysely
migration that alters the Postgres network enum (see `004_add_sonic_network.mts` and
`016_add_hyperliquid.mts`), then regenerate `database-types.ts` via `src/scripts/generate-types.ts`.

**Gotcha:** `database-types.ts` is generated (`kysely-codegen`) — edit the migration and regenerate
rather than editing it by hand.

## Cross-package connections

**Consumes:** `@summerfi/serverless-shared` (`ChainId`, in `src/helpers.ts`). That is the only
`@summerfi/*` package actually imported. `@summerfi/abstractions` is a declared dependency but is
never imported — stale. (`@summerfi/eslint-config` / `typescript-config` are build tooling.)

**Consumed by:** `armada-protocol-service`, `get-campaign-data-function`, `get-rates-function`,
`get-vault-rates-function`, `update-tally-delegates`, `update-summer-earn-rewards-apr`, and
`earn-protocol` (many server handlers + API routes). `app-types` declares the dependency in
`package.json` but does not import it (stale).

**Gotchas:**

- **Three-place chain single-source-of-truth.** The `DbNetworks` union + private `dbNetworkToChainId`
  map (`src/helpers.ts`), the Postgres `network` enum (extended by migrations like
  `004_add_sonic_network.mts` / `016_add_hyperliquid.mts`), and `ChainId` in
  `@summerfi/serverless-shared` must all agree — none derives from the others, and one of them lives
  in the live DB, not in code. `mapDbNetworkToChainId` / `mapChainIdToDbNetwork` throw at runtime on a
  missing entry.
- **`database-types.ts` is generated and committed.** `pnpm migrate:latest` runs the migrations then
  regenerates it by introspecting the DB — needs `EARN_PROTOCOL_DB_CONNECTION_STRING` pointing at a
  migrated DB. Every consumer imports this `Database` type.
- `getSummerProtocolDB` does not read env; each caller passes `EARN_PROTOCOL_DB_CONNECTION_STRING`
  itself (lambdas via `stacks/*.ts`, key registered in `turbo.json` `globalEnv`).
- See CLAUDE.md for the full cross-package / chain-config coupling and the add-a-chain checklist.
