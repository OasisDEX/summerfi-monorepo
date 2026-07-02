# @summerfi/contracts-provider-service

Implementation package that provides `ContractsProviderFactory` and `ContractsProvider`, which
create typed read/write contract wrappers from ABIs (`@summerfi/armada-protocol-abis`) over a
blockchain client. The concrete wrappers — `Erc20Contract`, `Erc4626Contract`,
`FleetCommanderContract`, `ArkContract`, `AdmiralsQuartersContract`, `SummerStakingContract`,
`ProtocolAccessManagerWhiteListContract`, `ProtocolAccessManagerV2Contract` (RWA role grant/revoke),
`RoundsVaultContract` (RWA round lifecycle: next/settle/settle-batch/retry/rollback), and
`GenericContractWrapper` — handle all on-chain calls and transaction encoding used by the allowance,
armada, and RWA managers.

## Key exports (`src/index.ts`)

| Export                                              | Role                                                                                                       |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `ContractsProviderFactory`                          | Instantiates a `ContractsProvider` given a config provider, blockchain client provider, and tokens manager |
| `ContractsProvider`                                 | Resolves typed contract wrappers by address/ABI                                                            |
| `Erc20Contract`, `Erc4626Contract`                  | Standard token and vault wrappers                                                                          |
| `FleetCommanderContract`, `ArkContract`             | Armada protocol core contract wrappers                                                                     |
| `AdmiralsQuartersContract`, `SummerStakingContract` | Governance / staking wrappers                                                                              |
| `GenericContractWrapper`                            | Base class for ad-hoc or untyped contracts                                                                 |

Implements interfaces defined in `@summerfi/contracts-provider-common` (the service/common split
follows the standard SDK layering; API reference lives in `gitbook/reference`).

## Commands

```bash
pnpm build       # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm tsc         # type-check only
pnpm watch       # incremental watch build
pnpm lint        # eslint
pnpm lint:fix    # eslint --fix
pnpm e2e         # jest e2e/
pnpm testw       # jest --watch
```

## Cross-package connections

**Consumes:** `@summerfi/contracts-provider-common` (interfaces), `@summerfi/abi-provider-common`,
`@summerfi/armada-protocol-abis`, `@summerfi/blockchain-client-common`,
`@summerfi/configuration-provider-common`, `@summerfi/tokens-common`, `@summerfi/sdk-common`.
`@summerfi/configuration-provider`, `@summerfi/tenderly-utils` and `@summerfi/tokens-service` are
used only by the `e2e/` tests.

**Consumed by:** `sdk-server`, `allowance-manager-service`, `armada-protocol-service`

**Gotchas:**

- ABI changes in `@summerfi/armada-protocol-abis` require a rebuild of this package before dependent
  services pick up the new types.
- No unit tests are present; coverage is provided only via `e2e/` tests, which require a live or
  forked network.
