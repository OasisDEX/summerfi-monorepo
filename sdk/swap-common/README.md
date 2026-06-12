# @summerfi/swap-common

Interface-only layer for the Summer.fi swap subsystem. The package (`@summerfi/swap-common`) defines
the three contracts that all swap implementations must satisfy: `ISwapManager` (top-level
orchestrator that selects a provider and exposes `getSwapDataExactInput`, `getSwapQuoteExactInput`,
and `getSummerFee`), `ISwapProvider` (per-DEX aggregator plugin for quote-and-calldata swaps), and
`IIntentSwapProvider` (intent-based plugin covering the CoW Protocol order lifecycle: quote, send,
check, and cancel; signing is passed in as `SigningResult` parameters, not a method on the
interface). There is no runtime logic in this package — it is a pure TypeScript type boundary shared
across the monorepo. SDK reference docs live in `gitbook/reference`.

## Key exports

All three interfaces are re-exported from the package root (`@summerfi/swap-common`):

| Export                | Role                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `ISwapManager`        | Top-level manager; extends `IManagerWithProviders` from `sdk-server-common`                                            |
| `ISwapProvider`       | Per-provider plugin for exact-input swaps (quote + calldata)                                                           |
| `IIntentSwapProvider` | Intent-order plugin (CoW Protocol); uses `EnrichedOrder`, `UnsignedOrder`, `SigningResult` from `@cowprotocol/cow-sdk` |

## Build / lint commands

Exact scripts from `package.json`:

```
pnpm build        # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm tsc          # plain type-check
pnpm watch        # tsc -w
pnpm lint         # eslint .
pnpm lint:fix     # eslint . --fix
```

There are no test scripts in this package.

## Cross-package connections

**Consumes:** `@summerfi/sdk-common` (token/amount/swap primitives, `SwapProviderType`,
`IntentSwapProviderType`, `SwapData`, `QuoteData`, `IntentQuoteData`), `@summerfi/sdk-server-common`
(`IManagerWithProviders`, `IManagerProvider`), `@cowprotocol/cow-sdk` (order types used by
`IIntentSwapProvider`).

**Consumed by:** `swap-service`, `armada-protocol-service`, `order-planner-common`,
`order-planner-service`, `protocol-plugins`, `protocol-plugins-common`, `simulator-service`,
`testing-utils`, `sdk-server`. These packages import the interfaces to type their swap
manager/provider implementations and injection points.

**Gotchas:** This package has no build output committed to the repo — dependents rely on the
TypeScript source via the `exports` map (`./src/index.js`). Any package that adds a new swap
provider must implement either `ISwapProvider` or `IIntentSwapProvider` and register it with the
concrete `SwapManager`; the interfaces themselves are hand-maintained and must be updated in sync
with `sdk-common` when `SwapProviderType` or `IntentSwapProviderType` enums change.
