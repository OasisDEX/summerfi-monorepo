# @summerfi/testing-utils

Shared test helpers for the Summer.fi SDK monorepo.

Provides mock implementations of the core manager interfaces (AddressBook, Oracle, Swap, Tokens,
BlockchainClientProvider, StepBuilderContext), calldata-decoding utilities (actions, positions
manager, strategy executor, Armada fleet), and transaction send/log helpers used in integration and
e2e tests.

## Cross-package connections

**Consumes:** `@summerfi/address-book-common`, `@summerfi/blockchain-client-common`,
`@summerfi/blockchain-client-provider`, `@summerfi/configuration-provider-common`,
`@summerfi/deployment-utils`, `@summerfi/oracle-common`, `@summerfi/protocol-plugins-common`,
`@summerfi/sdk-common`, `@summerfi/sdk-server-common`, `@summerfi/swap-common`,
`@summerfi/tokens-service` (build tooling: `eslint-config`, `jest-config`, `typescript-config`).

**Consumed by:**

- Runtime consumer — `tenderly-utils` (`src/TenderlyFork.ts` imports `TransactionUtils`); it declares
  testing-utils under `dependencies`, so this is a real production import, not a test-only one.
- Test/e2e consumers (real `from '@summerfi/testing-utils'` imports) — `protocol-plugins`
  (`tests/**`), `order-planner-service` (`tests/**`), `sdk-e2e` (`e2e/**`, `tests/**`),
  `armada-protocol-service` (`e2e/**`), `contracts-provider-service` (`e2e/**`).

**Gotchas:**

- **Stale declared deps.** Its own `package.json` lists `@summerfi/configuration-provider`,
  `@summerfi/deployment-types`, and `@summerfi/tokens-common` under `dependencies`, but nothing in
  `src` imports them — drop them if trimming the dependency graph.
- **Stale declared consumers.** `sdk-client`, `sdk-client-react`, `abi-provider-service`,
  `allowance-manager-service`, `subgraph-manager-service`, and `order-planner-common` declare
  testing-utils in `package.json` but have no source/test import of it — likely leftover devDeps.
- **Runtime deps, not devDeps.** testing-utils itself is a normal package with `dependencies` (not
  `devDependencies`), so pulling it in as a devDep still drags in `blockchain-client-provider`,
  `tokens-service`, etc.
- **`SDK_USE_FORK` env var.** `utils/SendAndLogTransactions.ts` and `utils/SendTransactionTool.ts`
  read `process.env.SDK_USE_FORK === 'true'` to switch between fork and live RPC. The key must be in
  `turbo.json` `globalEnv` (it is, line ~96) or the value is stripped from turbo-run tasks.
