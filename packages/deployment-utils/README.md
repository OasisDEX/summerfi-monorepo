# @summerfi/deployment-utils

Shared helpers for deploying and tracking Solidity contracts in the Summer.fi monorepo. The package
wraps Hardhat Viem to provide a lifecycle around contract deployment: sending transactions,
attaching to existing contracts, registering address dependencies, optionally verifying on
Etherscan, writing timestamped JSON deployment records, and regenerating TypeScript index files
(`index.ts` / `local.ts`) that downstream packages import to resolve on-chain addresses.

## Key exports

- **`Deployments`** — main class; instantiated with a `DeploymentInitParams` describing provider
  (`internal` | `hardhat` | `remote`), chain, and config name. Core methods: `deploy()`, `attach()`,
  `addDependency()`, `persist()`, `rebuildIndex(deploymentsDir, indexDir)`, `getAddress()`,
  `getContract()`.
- **`getDeploymentType()`** — reads the `CONTRACTS_DEPLOYMENT_TYPE` env var (format:
  `<provider>.<chain>.<config>`) and returns a typed `DeploymentType`; throws if the variable is
  absent.
- **`parseDeploymentName()`** — parses the same dot-separated string without reading env vars.
- **`DeploymentFlags`** — bitmask (`None`, `Export`, `Verify`) passed as `options` to control
  persistence and Etherscan verification.
- **`ProviderTypes`**, **`DeploymentChain`**, **`DeploymentIndex`**, and all viem re-exports
  (`Contract`, `WalletClient`, `TransactionReceipt`, etc.) for use in callers.
- **`showConsoleLogs(enable: boolean)`** (from `src/test`) — toggles `console.log` in Hardhat tests;
  pass `false` to suppress output, `true` to restore it.
- **`fastForwardChain()`, `getCurrentBlock()`, `getCurrentTimestamp()`** (from
  `src/utils/blockchain`) — test helpers that drive the Hardhat test client via viem.

## Commands

```bash
pnpm build       # tsc -b --preserveWatchOutput tsconfig.json  (compiles to dist/)
pnpm dev         # tsc -b --preserveWatchOutput tsconfig.json -w  (watch mode)
pnpm lint        # eslint .
pnpm lint:fix    # eslint . --fix
```

There is no `test` script in this package.

## Cross-package connections

**Consumes:**

- `@summerfi/hardhat-utils` — provides `ChainsType` used in the `Chain` union type.
- `@summerfi/common` — provides `Address` (dev dependency).
- `@summerfi/contracts-utils` — dev dependency for contract utilities.
- `hardhat` + `@nomicfoundation/hardhat-toolbox-viem` — dev dependencies for viem client access and
  `hre.run('verify:verify')`.

**Consumed by (direct `package.json` dependencies found in the repo):**

- `packages/deployment-configs`
- `packages/core-contracts`
- `sdk/address-book-service`, `sdk/protocol-plugins`, `sdk/protocol-plugins-common`,
  `sdk/order-planner-service`, `sdk/sdk-server`, `sdk/sdk-e2e`, `sdk/testing-utils`

**Gotchas:**

- `CONTRACTS_DEPLOYMENT_TYPE` must be set before calling `getDeploymentType()`; the format is
  `<provider>.<chain>.<config>` (e.g. `remote.mainnet.prod`).
- `persist()` requires both `deploymentsDir` and `indexDir` in `DeploymentInitParams`; omitting them
  causes a runtime throw.
- After any deployment, `rebuildIndex(deploymentsDir, indexDir)` regenerates `index.ts` (remote
  providers) and `local.ts` (hardhat provider) inside `indexDir`. SDK packages import these
  generated files for address resolution — re-run deployments or call
  `rebuildIndex(deploymentsDir, indexDir)` whenever deployment JSON records change.
- Previous deployment files are cycled to timestamped filenames (e.g.
  `remote.mainnet.prod.1718000000.json`) on non-develop networks; only the latest file (no timestamp
  suffix) is included in the rebuilt index.
