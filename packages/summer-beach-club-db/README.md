# @summerfi/summer-beach-club-db

PostgreSQL schema, Kysely-typed client, and migration scripts for the Summer Beach Club referral and
rewards system.

## What it contains

- **`getBeachClubDb(config)`** — factory that returns a `BeachClubDB` object (`{ db: Kysely<DB> }`)
  backed by a `pg` connection pool.
- **`database-types.ts`** — auto-generated table types (`DB`, `Users`, `ReferralCodes`,
  `RewardsBalances`, `Positions`, etc.) produced by `kysely-codegen`; do not edit by hand.
- **`src/migrations/`** — versioned Kysely migrations (`up`/`down`).
- **`src/scripts/`** — local migration helpers (`migrate:latest`, `migrate:up`, `migrate:down`,
  `migrate:reset`), each followed by an automatic `codegen:kysely` run.

## Usage

```ts
import { getBeachClubDb } from '@summerfi/summer-beach-club-db'

const { db } = getBeachClubDb({ connectionString: process.env.DATABASE_URL! })
```

## Local development

Requires a running Postgres instance (see `docker-compose.yml`).

```sh
pnpm migrate:latest   # apply all pending migrations and regenerate types
```

## Gotcha

Every migration script re-runs `pnpm codegen:kysely` automatically. If you run migrations outside
the provided scripts, regenerate `database-types.ts` manually (`pnpm codegen:kysely`) before
building or the TypeScript types will be stale.

## Cross-package connections

**Consumes:** nothing from the monorepo at runtime. `@summerfi/abstractions` is declared in
`package.json` but is not imported anywhere in `src` — stale dependency. `@summerfi/eslint-config`
and `@summerfi/typescript-config` are dev/build tooling only.

**Consumed by:** `earn-protocol` (all `app/api/beach-club/*` and `app/api/game/*` routes plus
`app/server-handlers/raw-calls/beach-club/*`, e.g. `get-user-beach-club-data.ts`) and
`update-beach-club-rewards-function` (`background-jobs/`, in `src/db.ts` / `config.ts` /
`processor.ts`). Both import `getBeachClubDb` and the generated table types (`DB`, `Users`,
`ReferralCodes`, `RewardsBalances`, `Positions`, ...).

**Gotchas:**

- **`database-types.ts` is a committed, generated artifact consumed across packages without an
  import graph link.** `kysely-codegen` introspects the LIVE Postgres pointed at by
  `.kysely-codegenrc.json` (`url: env(BEACH_CLUB_REWARDS_DB_CONNECTION_STRING)`), so regenerating
  requires a reachable DB whose schema matches the migrations. If a migration lands without a
  matching regen (or is regenned against a drifted DB), consumers compile against wrong column
  types with no error here. The migration scripts chain `codegen:kysely` to keep these in sync — see
  the Gotcha above.
- **Migration bookkeeping table is custom-named `migrations`** (`migrationTableName: 'migrations'`
  in `src/scripts/local-config.ts`). Any external tooling inspecting applied migrations must use
  that name, not Kysely's default `kysely_migration`.
- Follows the "Add/modify a table in a Postgres DB package" checklist in the repo-root `AGENTS.md`
  (add a migration under `src/migrations/`, run `pnpm migrate:latest`, commit the regenerated
  `database-types.ts`).

**Env vars:** `BEACH_CLUB_REWARDS_DB_CONNECTION_STRING` is the single connection string.
`src/scripts/local-config.ts` and `.kysely-codegenrc.json` read it (throwing if unset); it is
listed in `turbo.json` `globalEnv` and injected into the rewards Lambda by
`stacks/summer-protocol.ts` (which also throws if it is unset). Consumers pass their own value into
`getBeachClubDb({ connectionString })` — the package itself does not read env at runtime, only its
migration/codegen scripts do.
