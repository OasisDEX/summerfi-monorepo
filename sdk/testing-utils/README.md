# @summerfi/testing-utils

Shared test helpers for the Summer.fi SDK monorepo.

Provides mock implementations of the core manager interfaces (AddressBook, Oracle, Swap, Tokens,
BlockchainClientProvider, StepBuilderContext), calldata-decoding utilities (actions, positions
manager, strategy executor, Armada fleet), and transaction send/log helpers used in integration and
e2e tests.

**Who uses it:** devDependency of most SDK service packages (`sdk-client`, `sdk-client-react`,
`sdk-e2e`, `abi-provider-service`, `allowance-manager-service`, `armada-protocol-service`,
`subgraph-manager-service`); listed under `dependencies` (not devDependencies) in `tenderly-utils`,
`order-planner-common`, `order-planner-service`, `protocol-plugins`, and
`contracts-provider-service`.

**Gotcha:** The package is listed under `dependencies` (not `devDependencies`) in its own
`package.json`, so its runtime deps (`blockchain-client-provider`, `tokens-service`, etc.) are
always pulled in — keep that in mind if transitive bundle size matters.
