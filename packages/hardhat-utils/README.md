# @summerfi/hardhat-utils

`@summerfi/hardhat-utils` provides a shared Hardhat configuration base and network helpers for all
Hardhat projects in the monorepo. Consumer packages import `DefaultHardhatConfig` or
`getHardhatConfig` from this package and shallow-merge their own overrides on top, avoiding
duplicated network, gas, ABI-exporter, and Etherscan settings across packages.

## Key exports (`src/index.ts` → `src/config/index.ts`)

| Export                                                               | Description                                                                                            |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `DefaultHardhatConfig`                                               | Ready-to-use `HardhatUserConfig` with pre-wired networks, ABI exporter, Etherscan, and solidity-docgen |
| `getHardhatConfig(userConfig)`                                       | Shallow-merges `userConfig` over `DefaultHardhatConfig`                                                |
| `ChainIds`, `Networks`, `ChainsType`                                 | Chain-ID map and derived network list/type                                                             |
| `Gas`, `GasPrice`, `EndpointURLs`, `EndpointProvider`                | Per-network gas and RPC endpoint tables                                                                |
| `getChainConfig`, `getHardhatChainConfig`, `getLocalhostChainConfig` | Per-network `NetworkUserConfig` builders                                                               |
| `getEtherscanApiKey`                                                 | Reads and optionally JSON-parses `ETHERSCAN_API_KEY`                                                   |

## Build commands

All scripts are in `package.json` under the name `@summerfi/hardhat-utils`.

```
pnpm build   # tsc -b --preserveWatchOutput -v
pnpm watch   # tsc -w
pnpm lint    # eslint .
pnpm lint:fix
```

There is no separate test script in this package.

## Cross-package connections

**Consumes**

- `hardhat` (peer/dev) — the config types this package wraps
- `@nomicfoundation/hardhat-toolbox-viem`, `hardhat-abi-exporter`, `solidity-docgen` — plugins
  imported directly in `hardhat.default.ts`; consumers inherit them automatically

**Consumed by** (verified via `package.json` dependencies in the monorepo)

- `@summerfi/contracts-utils`
- `@summerfi/core-contracts`
- `@summerfi/deployment-configs`
- `@summerfi/deployment-utils`

**Required environment variables** (validated at module load time in `hardhat.helpers.ts`; missing
values throw at import)

| Variable                                                          | Required when                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------ |
| `DEPLOYER_MNEMONIC` or `DEPLOYER_PRIVATE_KEY`                     | Always (checked unconditionally at module import time) |
| `RPC_ENDPOINT_PROVIDER`                                           | Must be `infura` or `alchemy`                          |
| `INFURA_ENDPOINT_API_KEY`                                         | When provider is `infura`                              |
| `ALCHEMY_ENDPOINT_API_KEY`                                        | When provider is `alchemy`                             |
| `ETHERSCAN_API_KEY`                                               | Optional; Etherscan verification                       |
| `COINMARKETCAP_API_KEY`                                           | Optional; gas reporter USD pricing                     |
| `CONTRACTS_ENABLE_GAS_REPORT`                                     | Set to `"true"` to enable gas reporter                 |
| `CONTRACTS_DEPLOYMENT_MAX_GAS` / `CONTRACTS_DEPLOYMENT_GAS_PRICE` | Optional gas overrides                                 |

**Gotcha:** `hardhat.helpers.ts` runs the env-var validation at module import time. Any package that
imports `@summerfi/hardhat-utils` in a non-Hardhat context (e.g., a plain Node script) will throw
unless the required env vars are set.
