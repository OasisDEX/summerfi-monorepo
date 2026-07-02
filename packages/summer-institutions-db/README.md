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

## Cross-package connections

**Consumes:** `@summerfi/serverless-shared` (only `ChainId`, in `src/helpers.ts`, to build the
`dbNetworkToChainId` map). `@summerfi/abstractions` is declared in `package.json` but never imported
in `src` — stale dependency. Build-only: `@summerfi/eslint-config`, `@summerfi/typescript-config`.

**Consumed by:** `earn-protocol-institutions` — the only consumer. Server handlers call
`getSummerProtocolInstitutionDB({ connectionString })` and query the `institutions`,
`institution_users`, `global_admins` and `feedback_messages` tables
(`app/server-handlers/admin/institution/index.ts`, `.../admin/user/index.ts`,
`.../institution/institution-users/index.ts`, `.../institution/institution-feedback/index.ts`,
`.../institution/institution-data/index.ts`, `.../auth/user.ts`); several `features/`/`types/`
files import the generated row types and the `DbNetworks` / `mapDbNetworkToChainId` /
`mapChainIdToDbNetwork` helpers.

**Gotchas:**

- **Runtime connection string, not an import.** No SST stack wires this package. The consuming app
  reads `EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING` from the environment and passes it into
  `getSummerProtocolInstitutionDB`. The key is listed in `turbo.json` and injected by the
  earn-protocol-institutions deployment (`docker/Dockerfile`); if it is unset or wrong the client
  throws `Failed to connect to institutions database` on the startup `SELECT 1` probe.
- **`database-types.ts` is committed and hand-synced via migrations.** `kysely-codegen` regenerates
  it only inside the `migrate:*` scripts (which need a live DB reachable at
  `EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING`), not during `build`. Adding a migration without
  running `migrate:*` leaves the committed types stale, and the app's queries type-check against the
  stale shape.
- **`CamelCasePlugin` is on.** Postgres columns are snake_case but every query and the generated row
  types are camelCase. Raw `sql` fragments must still reference the snake_case column names.
- **Duplicated `DbNetworks` / `dbNetworkToChainId` map.** `src/helpers.ts` hand-maintains the same
  network-string ↔ `ChainId` map as `packages/summer-protocol-db/src/helpers.ts`. The two packages
  do NOT share an import, so adding a chain must be mirrored in both, and both must stay in step with
  `ChainId` in `@summerfi/serverless-shared` (`packages/serverless-shared/src/domain-types.ts`).
