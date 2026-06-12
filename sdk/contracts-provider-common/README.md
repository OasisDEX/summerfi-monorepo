# @summerfi/contracts-provider-common

Interface layer for the Summer.fi contracts provider subsystem. This package defines
`IContractsProvider` — the contract through which services retrieve typed smart-contract wrappers —
together with all individual wrapper interfaces (`IErc20Contract`, `IErc4626Contract`,
`IFleetCommanderContract`, `IRoundsVaultContract`, `ISummerStakingContract`, `IArkContract`,
`IAdmiralsQuartersContract`, `IConfigurationManagerContract`, `IFleetCommanderWhitelistContract`,
`IProtocolAccessManagerWhiteListContract`, `IProtocolAccessManagerV2Contract`) and the
`RebalanceDataSolidity` type. Contract wrappers expose view calls directly and generate calldata for
write functions; they do not send transactions. This package is the `-common` half of the
common/service split — the concrete implementations live in `contracts-provider-service`. SDK
reference docs live in `gitbook/reference`.

## Key exports

| Export                                                                                                | Description                                                                |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `IContractsProvider`                                                                                  | Provider interface; each `get*Contract` method resolves to a typed wrapper |
| `IContractWrapper`                                                                                    | Base wrapper interface extended by all typed wrappers                      |
| `IErc20Contract`, `IErc4626Contract`                                                                  | Standard token wrapper interfaces                                          |
| `IFleetCommanderContract`, `IArkContract`, `IAdmiralsQuartersContract`                                | Armada protocol wrapper interfaces                                         |
| `IFleetCommanderWhitelistContract`, `IConfigurationManagerContract`                                   | Fleet management / configuration wrapper interfaces                        |
| `ISummerStakingContract`                                                                              | Summer staking wrapper interface                                           |
| `IRoundsVaultContract`, `IProtocolAccessManagerV2Contract`, `IProtocolAccessManagerWhiteListContract` | RWA / institutional wrapper interfaces                                     |
| `RebalanceDataSolidity`                                                                               | Solidity-level rebalance calldata type                                     |

## Commands

```bash
pnpm build      # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm watch      # tsc -w (incremental)
pnpm tsc        # tsc (type-check only)
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

No test script is defined in this package.

## Cross-package connections

**Consumes:** `@summerfi/abi-provider-common`, `@summerfi/blockchain-client-common`,
`@summerfi/sdk-common`

**Consumed by:** `contracts-provider-service` (implementations), `allowance-manager-service`,
`armada-protocol-common`, `armada-protocol-service`, `order-planner-common`,
`order-planner-service`, `sdk-server`

**Gotchas:**

- The wrapper interface list is Armada/RWA-centric. Adding a new contract type requires adding its
  interface here first, then adding the concrete implementation in `contracts-provider-service`.
  Both steps are manual — there is no codegen.
