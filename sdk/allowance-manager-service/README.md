# @summerfi/allowance-manager-service

Server-side implementation of the allowance manager used by the Summer.fi SDK. This package provides
`AllowanceManager` (implements `IAllowanceManager` from `allowance-manager-common`) and
`AllowanceManagerFactory`, which together back the router's `allowance` namespace — handling ERC-20
approval transactions, Permit2 authorization / revocation transactions, and off-chain Permit2
typed-data generation (10-minute expiry). It sits in the common/service layering as the concrete
service that pairs with the `allowance-manager-common` interface package.

## Key exports

| Export                    | Description                                                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AllowanceManager`        | Implements `IAllowanceManager`: `getApproval`, `isPermit2AuthorizationNeeded`, `getPermit2AuthorizationTx`, `getPermit2RevokeTx`, `getPermit2Data` |
| `AllowanceManagerFactory` | Static `newAllowanceManager({ configProvider, contractsProvider, blockchainClientProvider })` factory                                              |

SDK reference docs live in `gitbook/reference`.

## Commands

```bash
pnpm build      # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm tsc        # type-check only
pnpm watch      # tsc -w
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
pnpm e2e        # jest e2e/
pnpm testw      # jest --watch
```

## Cross-package connections

**Consumes (runtime dependencies):**

- `@summerfi/allowance-manager-common` — `IAllowanceManager` interface this package implements
- `@summerfi/blockchain-client-common` — `IBlockchainClientProvider` for on-chain reads (allowance
  checks)
- `@summerfi/configuration-provider-common` — `IConfigurationProvider` injected into
  `AllowanceManager`
- `@summerfi/contracts-provider-common` — `IContractsProvider` for ERC-20 contract wrappers
- `@summerfi/sdk-common` — `LoggingService`, `TransactionType`, `getChainInfoByChainId`, token
  address constants
- `@summerfi/common` — base utilities (runtime dependency)
- `@uniswap/permit2-sdk` — `permit2Address` helper

**Consumed by:**

- `sdk-server` — wires `AllowanceManagerFactory` into the router's `allowance` namespace
- `armada-protocol-service` — injects `AllowanceManager` into its managers
- `swap-service` — injects `AllowanceManager` into `CowSwapProvider`

**Gotchas:**

- `@summerfi/blockchain-client-provider` and `@summerfi/contracts-provider-service` are dev
  dependencies only (used in tests); do not import them from application code.
- Permit2 nonce is derived from `Date.now()` — callers must sign and submit before the 10-minute
  deadline; do not cache `getPermit2Data` results across sessions.
- Native currency (`NATIVE_CURRENCY_ADDRESS_LOWERCASE`) is explicitly excluded from all Permit2
  flows; `getPermit2AuthorizationTx` and `getPermit2RevokeTx` will throw on native token input.
