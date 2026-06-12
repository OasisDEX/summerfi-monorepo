# @summerfi/swap-service

Server-side swap implementation package that provides `SwapManager`, `SwapManagerFactory`,
`OneInchSwapProvider`, and `CowSwapProvider`. `SwapManagerFactory` assembles a `SwapManager` with
the 1inch provider for standard swaps; `CowSwapProvider` implements the `IIntentSwapProvider`
interface for intent-based (CoW Protocol) swaps. Both providers sit in the `common/service` layer
pattern — interfaces live in `swap-common`, implementations live here.

## Key exports

- `SwapManagerFactory` — creates a `SwapManager` with `OneInchSwapProvider` registered; accepts an
  `IConfigurationProvider`
- `SwapManager` — multi-provider swap manager implementing the interface from `swap-common`
- `OneInchSwapProvider` — `ISwapProvider` implementation; calls the 1inch Swap v6 REST API
- `CowSwapProvider` / `CowSwapSendOrderStatus` — `IIntentSwapProvider` implementation using
  `@cowprotocol/cow-sdk`

SDK reference docs live in `gitbook/reference`.

## Build / test / dev commands

```
pnpm build      # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm tsc        # type-check only
pnpm watch      # tsc -w
pnpm test       # jest tests/
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

## Cross-package connections

**Consumes:** `swap-common` (interfaces), `allowance-manager-common`, `blockchain-client-common`,
`configuration-provider-common`, `tokens-common`, `sdk-common`, `sdk-server-common`

**Consumed by:** `sdk-server` (via `SwapManagerFactory`), `armada-protocol-service`

**Gotchas:**

- `CowSwapProvider` is constructed directly in `SDKContext.ts` (not via `SwapManagerFactory`), so it
  is wired as `ctx.intentSwapsManager` independently of the factory path.
- 1inch behavior is controlled by env vars read through `IConfigurationProvider`:
  `ONE_INCH_API_URL`, `ONE_INCH_API_KEY`, `ONE_INCH_API_VERSION`, and
  `ONE_INCH_ALLOWED_SWAP_PROTOCOLS` are required and throw at construction time if missing.
  `ONE_INCH_SWAP_CHAIN_IDS` (comma-separated chain IDs) and `ONE_INCH_EXCLUDED_SWAP_PROTOCOLS`
  (comma-separated; absent or empty string disables filtering) are optional — missing values produce
  an empty list without throwing.
- CowSwap uses `COW_SWAP_API_KEY` (read via config provider) and depends on
  `allowance-manager-common` and `blockchain-client-common` at runtime, which are not needed by the
  1inch provider.
