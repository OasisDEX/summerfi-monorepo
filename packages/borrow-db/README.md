# @summerfi/borrow-db

Typed [Kysely](https://kysely.dev/) client for the Summer.fi borrow PostgreSQL database. It exports
a factory function (`getBorrowDB`) that opens a connection using the `postgres` driver and returns a
fully-typed `Kysely<DB>` instance with camelCase column mapping applied. The `DB` type and all table
interfaces (`Vault`, `ProductHubItems`, `AjnaRewardsDailyClaim`, `TosApproval`, etc.) are generated
from the live schema and live in `src/database-types.ts`.

## Key exports

| Export                           | Description                                                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `getBorrowDB(config)`            | Async factory; returns `{ db: Kysely<DB> }`                                                                                             |
| `PgBorrowDbConfig`               | Interface — `connectionString: string`, `logger: Logger`                                                                                |
| `BorrowDB`                       | Interface wrapping the typed `Kysely<DB>` handle                                                                                        |
| `DB` (internal, not re-exported) | Root Kysely database type mapping all 22 tables/views; defined in `src/database-types.ts` but not exported from the package entry point |

## Scripts

```
pnpm build          # tsc -b --preserveWatchOutput -v tsconfig.build.json → dist/
pnpm dev            # tsc -b --preserveWatchOutput -w tsconfig.build.json
pnpm test           # jest --passWithNoTests
pnpm lint           # eslint .
pnpm lint:fix       # eslint . --fix
pnpm codegen        # kysely-codegen --camel-case --out-file ./src/database-types.ts
```

## Cross-package connections

**Consumes**

- `@summerfi/abstractions` — `Logger` interface used in `PgBorrowDbConfig`

**Consumed by**

- No other workspace package declares a dependency on `@summerfi/borrow-db` in its `package.json`.
  The package is referenced in `sst.config.ts` only as an infra comment (`oasis-borrow-db` service
  check).

**Gotchas**

- `src/database-types.ts` is **generated** — run `pnpm codegen` after any schema migration before
  editing query code. The codegen command requires a live database connection; set `DATABASE_URL`
  (or the equivalent connection string env var expected by `kysely-codegen`) in the environment
  first.
- The Kysely client is constructed with `CamelCasePlugin`, so all column names in query builders and
  result types use camelCase even if the underlying Postgres columns are snake_case.
