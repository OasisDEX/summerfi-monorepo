# summer-protocol-db — cross-package dependencies

Kysely-backed Postgres client for the Summer Protocol database. Exports `getSummerProtocolDB`
(`Promise<{ db: Kysely<Database> }>`, `CamelCasePlugin` applied), the generated `Database` type
(`src/database-types.ts`), and the chain-mapping helpers `mapDbNetworkToChainId` /
`mapChainIdToDbNetwork` + the `DbNetworks` type (`src/helpers.ts`).

This file documents the cross-package coupling that causes silent breakage: (a) the chain
single-source-of-truth that is duplicated in **three** places, and (b) `database-types.ts`, a
generated-and-committed artifact consumed by import everywhere.

## Data sources & what each provides

| Dependency / artifact                              | Provides                                                                                                                                   | Notes                                                                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `@summerfi/serverless-shared`                      | `ChainId` (the canonical chain registry `mapDbNetworkToChainId` / `mapChainIdToDbNetwork` map to/from)                                     | The **only** `@summerfi/*` package actually imported (in `src/helpers.ts`).                              |
| Postgres `network` enum (in the target DB)         | The set of network values columns may hold; created in an early migration, extended by `ALTER TYPE network ADD VALUE` (see 004/016)        | Must match the `DbNetworks` string union exactly — Postgres and TypeScript are separate sources of truth. |
| `src/database-types.ts` (generated, committed)     | The `Database` type every consumer imports for query typing                                                                                | Produced by `kysely-codegen` introspecting a **migrated live DB**; hand-editing it is wrong (see below). |
| Numbered migrations `src/migrations/00x_*.mts`     | The actual schema/enum in Postgres                                                                                                         | Applied out-of-band against the real DB; not run by consumers.                                           |

`@summerfi/abstractions` is a declared dependency but is **not imported** anywhere in `src` — stale;
drop it if you touch `package.json`.

## Environment variables

- `EARN_PROTOCOL_DB_CONNECTION_STRING` — the Postgres connection string. This package itself only
  reads it in the migration/codegen scripts (`src/scripts/local-config.ts`, via
  `dotenv` from the repo-root `../../.env`). `getSummerProtocolDB` does **not** read env — every
  consumer passes the connection string in explicitly, e.g. the lambdas in
  `summerfi-api/get-rates-function` / `get-vault-rates-function`, `external-api/get-campaign-data-function`,
  `sdk/armada-protocol-service`, the `background-jobs/*` crons, and `apps/earn-protocol` server
  handlers. The key is registered in `turbo.json` `globalEnv` and injected into stacks by
  `stacks/apy.ts`, `stacks/summer-protocol.ts`, `stacks/partners-stack.ts`, and
  `sdk/sst-environment.ts`.

## The chain single-source-of-truth (three places that drift silently)

Adding or removing a supported chain means keeping these in lockstep — none derive from the others:

1. **`DbNetworks` union + the private `dbNetworkToChainId` map** in `src/helpers.ts`. The string
   values (`'mainnet' | 'base' | 'arbitrum' | 'optimism' | 'sonic' | 'hyperliquid'`) happen to equal
   the `ChainId` string values in `@summerfi/serverless-shared`, but the map is hand-written; a
   missing entry makes `mapDbNetworkToChainId` / `mapChainIdToDbNetwork` throw at runtime.
2. **The Postgres `network` enum** — add a migration that does
   `ALTER TYPE network ADD VALUE '<chain>'` (and, if applicable, seeds `network_status`); precedent:
   `004_add_sonic_network.mts`, `016_add_hyperliquid.mts`. Postgres cannot remove enum values, so
   the `down` migrations only delete `network_status` rows.
3. **`@summerfi/serverless-shared` `ChainId`/`Network`** (`packages/serverless-shared/src/domain-types.ts`)
   must contain the chain first — this is the canonical registry the whole lambda layer keys off
   (see AGENTS.md "Add a new chain — APIs").

This is a sibling of the `sdk-common` `ChainIds.ts` four-file gotcha, but here one of the sources of
truth (the Postgres enum) lives **in the database, not in code** — a mismatch only surfaces as a
runtime insert/query error against the live DB.

## Adding a new chain — checklist

1. Add the chain to `ChainId` in `@summerfi/serverless-shared` first (AGENTS.md "Add a new chain — APIs" step 1).
2. Extend the `DbNetworks` union and the `dbNetworkToChainId` map in `src/helpers.ts`.
3. Add a migration in `src/migrations/` that `ALTER TYPE network ADD VALUE '<chain>'` (copy `016_add_hyperliquid.mts`).
4. Run `pnpm migrate:latest` — it applies migrations **and** regenerates `src/database-types.ts` by
   introspecting the DB (`src/scripts/local-migrate-latest.ts` → `generateTypes`). Commit the
   regenerated file.
5. Rebuild consumers; nothing in them changes for the enum itself, but a new column/table typed off
   `network` will only appear once `database-types.ts` is regenerated.

## Regenerating `database-types.ts`

It is committed but **generated** — do not edit by hand. `pnpm migrate:latest` / `migrate:up`
(`src/scripts/local-*.ts`) run the migrations and then `generateTypes` (`src/scripts/generate-types.ts`,
`kysely-codegen` introspection) which overwrites `src/database-types.ts`. This needs
`EARN_PROTOCOL_DB_CONNECTION_STRING` pointing at a DB that is already at the target migration level.

## Notes

- `getSummerProtocolDB` eagerly runs `SELECT 1` and `db.destroy()`s + throws
  `Failed to connect to Summer Protocol database` on failure, so callers get a fast, explicit connect
  error rather than a lazy pool failure on first query.
- Consumed by (real source importers): `armada-protocol-service`, `get-campaign-data-function`,
  `get-rates-function`, `get-vault-rates-function`, `update-tally-delegates`,
  `update-summer-earn-rewards-apr`, and `earn-protocol` (many server handlers / API routes).
  `app-types` declares the dependency in `package.json` but does **not** import it — stale.
