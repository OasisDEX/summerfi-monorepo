# @summerfi/triggers-shared

Shared types, Zod schemas, numeric constants, and contract-response shapes for the Summer.fi
automation trigger system. Every package that registers, reads, or calculates triggers across Aave
v3, Spark, MorphoBlue, and Maker draws its canonical data model from this package.

## Key exports / entry points

Two export conditions are published:

| Specifier                             | What it contains                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@summerfi/triggers-shared` (`.`)     | `SupportedTriggers` enum (URL path segments for the `/api/triggers/{chainId}/{protocol}/{trigger}` route), `SupportedActions` enum (`add`/`remove`/`update`), `positionSchema`, `priceSchema`, `tokenSchema`, numeric constants (`PRICE_DECIMALS`, `PERCENT_DECIMALS`, `MINIMUM_LTV_TO_SETUP_TRIGGER`, …), and `getAddresses(chainId)` |
| `@summerfi/triggers-shared/contracts` | `GetTriggersResponse` (the full typed shape of `GET /api/triggers`), all per-trigger decoded-params types (e.g. `DmaAavePartialTakeProfit`, `MorphoBlueTrailingStopLoss`), numeric trigger-type IDs (e.g. `DmaAavePartialTakeProfitID = 133n`), and `getPropertyFromTriggerParams`                                                     |

## Build / test / dev commands

```
pnpm build      # tsc -b --preserveWatchOutput -v
pnpm dev        # tsc -b --preserveWatchOutput -w
pnpm test       # jest --passWithNoTests
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

## Cross-package connections

**Consumes**

- `@summerfi/serverless-shared` — `ChainId`, `ProtocolId`, `LTV`, `addressSchema`, `bigIntSchema`,
  and domain types used in every schema here
- `@oasisdex/addresses` (`0.1.22-automation`) — on-chain contract addresses resolved by
  `getAddresses()`; the pinned pre-release tag must stay in sync with automation deployments

**Consumed by**

- `@summerfi/triggers-calculations` (`packages/triggers-calculations`) — imports types and schemas
  to run LTV/price calculations
- `summerfi-api/get-triggers-function` — serves `GET /api/triggers`; its response shape is
  `GetTriggersResponse`
- `summerfi-api/setup-trigger-function` — handles
  `POST /api/triggers/{chainId}/{protocol}/{trigger}`; validates the path segment against
  `SupportedTriggers`

**Adding a new trigger type**

1. Add a kebab-case value to `SupportedTriggers` in `src/types.ts` (this value becomes the
   `{trigger}` URL segment).
2. Define the trigger's Zod schema and TypeScript types in the same file.
3. Extend `GetTriggersResponse` in `src/contracts/get-triggers-response.ts` so the new trigger
   appears in the `GET /api/triggers` contract.
4. Rebuild (`pnpm build`) before the consuming API functions will pick up the changes.
