# @summerfi/update-summer-earn-paginated-tables

A set of AWS Lambda handlers (EventBridge scheduled events) that trigger cache refreshes for the
paginated data tables served by the Summer Earn frontend. Each handler calls the Earn app's
`POST /earn/api/update-tables-data` endpoint with a bearer token and the name of the table to
refresh (`latest-activity`, `top-depositors`, `rebalance-activity`, or `vaults-benchmark`). All
logging is handled via `@aws-lambda-powertools/logger`.

## Key entry points

| Export                     | File                               | Table refreshed      |
| -------------------------- | ---------------------------------- | -------------------- |
| `latestActivityHandler`    | `src/update-latest-activity.ts`    | `latest-activity`    |
| `topDepositorsHandler`     | `src/update-top-depositors.ts`     | `top-depositors`     |
| `rebalanceActivityHandler` | `src/update-rebalance-activity.ts` | `rebalance-activity` |
| `vaultsBenchmarkHandler`   | `src/update-vaults-benchmark.ts`   | `vaults-benchmark`   |

Shared logic lives in `src/helpers/updater.ts` (env-var validation, logging) and
`src/helpers/update-table.ts` (the `fetch` call).

## Build / test / lint

```
pnpm build        # tsc -b --preserveWatchOutput -v
pnpm test         # jest --passWithNoTests
pnpm lint         # eslint .
pnpm lint:fix     # eslint . --fix
```

## Cross-package connections

**Consumes:**

- `@summerfi/eslint-config` and `@summerfi/typescript-config` (dev, workspace)
- `@aws-lambda-powertools/logger` (runtime)

**Who consumes it:** The SST/Lambda infrastructure wires each exported handler to a scheduled
EventBridge rule. No other workspace package imports this package directly.

**Required environment variables (missing any causes the handler to log an error and return
early):**

- `EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN` — bearer token accepted by the Earn app endpoint
- `EARN_APP_URL` — base URL of the Earn frontend (e.g. `https://summer.fi`)
- `NODE_ENV` — must be set; used as a basic sanity check

**Gotcha:** There is no `format:fix` script in `package.json`; formatting is handled by the
workspace-level ESLint config via `pnpm lint:fix`.
