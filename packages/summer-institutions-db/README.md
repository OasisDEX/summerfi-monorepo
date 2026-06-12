# @summerfi/summer-protocol-institutions-db

Kysely client, TypeScript types, and Postgres migrations for the Summer Protocol institutions
database.

The database holds four tables: `institutions`, `institution_users`, `global_admins`, and
`feedback_messages` (threaded, with category/status enums). Column names are snake_case in Postgres
and automatically camelCased at query time via Kysely's `CamelCasePlugin`.

## Usage

```ts
import { getSummerProtocolInstitutionDB } from '@summerfi/summer-protocol-institutions-db'

const { db } = await getSummerProtocolInstitutionDB({
  connectionString: process.env.EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING,
})
```

`getSummerProtocolInstitutionDB` validates the connection immediately; it throws if the database is
unreachable.

## Local migrations

Copy `.env.template` to `.env`, set `EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING`, then:

```
pnpm migrate:latest   # run all pending migrations
pnpm migrate:up       # run next migration
pnpm migrate:down     # roll back last migration
```

**Note:** `database-types.ts` is committed to the repo. All three migration scripts automatically
regenerate it via an internal `kysely-codegen` call after applying migrations, so types stay in sync
after any `migrate:*` run. The `build` script does not regenerate types — it only compiles
TypeScript.
