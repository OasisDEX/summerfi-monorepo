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
