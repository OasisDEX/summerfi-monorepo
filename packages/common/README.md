# @summerfi/common

A minimal shared-utilities package (`@summerfi/common`) that provides cross-cutting TypeScript
primitives used across the Summer.fi monorepo. It has no runtime dependencies of its own — only
`@summerfi/eslint-config` and `@summerfi/typescript-config` as dev dependencies.

## Key exports

| Export                                                                                                                 | Kind     | Description                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Address`                                                                                                              | type     | `0x${string}` — lightweight EVM address type (a note in source flags a possible future migration to the SDK's own address type) |
| `RecursivePartial<T>`                                                                                                  | type     | Deep-partial utility type for nested objects                                                                                    |
| `JSONStringifyWithBigInt`                                                                                              | function | `JSON.stringify` wrapper that serialises `bigint` values as strings                                                             |
| `MINUTE_IN_SECONDS`, `HOUR_IN_SECONDS`, `DAY_IN_SECONDS`, `WEEK_IN_SECONDS`, `YEAR_IN_SECONDS`, `LEAP_YEAR_IN_SECONDS` | const    | Integer time constants in seconds                                                                                               |

Entry point: `src/index.ts` (workspace import) / `dist/index.js` (built output).

## Commands

```bash
pnpm build      # tsc -b --preserveWatchOutput -v
pnpm dev        # tsc -b --preserveWatchOutput -w
pnpm test       # jest --passWithNoTests
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

## Cross-package connections

**Consumes:** nothing from the workspace (no workspace dependencies).

**Consumed by** (direct `package.json` dependents): `@summerfi/sdk-common`, `@summerfi/sdk-server`,
`@summerfi/sdk-server-common`, and all SDK service packages (`contracts-provider-service`,
`address-book-service`, `allowance-manager-service`, `armada-protocol-service`, `tokens-service`,
`oracle-service`, `subgraph-manager-service`, `swap-service`, `abi-provider-service`), as well as
`@summerfi/deployment-types`, `@summerfi/deployment-configs`, `@summerfi/deployment-utils`, and
`@summerfi/core-contracts`.

**Gotchas:**

- The `Address` type is intentionally kept separate from the SDK's own address type; the in-source
  TODO acknowledges this may need reconciliation with `@summerfi/sdk-common` types in the future.
- No codegen, no env vars, no hand-maintained lists required. Changes here propagate automatically
  to all dependents via TypeScript project references.
