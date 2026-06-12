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
