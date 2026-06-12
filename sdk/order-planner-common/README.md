# @summerfi/order-planner-common

Shared interface and utility layer for order building in the Summer.fi SDK. Defines the contracts
(`IOrderPlanner`, `IOrderPlannerService`) and input schemas (`IBuildOrderInputs`,
`BuildOrderInputsDataSchema`) that individual order planner implementations and the order planner
service must satisfy, along with ABI-encoding utilities used to construct on-chain transactions from
planned strategies. This package is a common/interface layer — it ships no service implementation;
the concrete runtime lives in `order-planner-service`.

## Key exports

| Export                                              | Kind               | Description                                                                                      |
| --------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| `IOrderPlanner`                                     | interface          | Single planner: `buildOrder(params)` → `Promise<Maybe<Order>>`, `getAcceptedSimulations()`       |
| `IOrderPlannerService`                              | interface          | Service facade: dispatches `buildOrder` to the correct planner by simulation type                |
| `BuildOrderParams`                                  | type               | Merged `IBuildOrderInputs & IBuildOrderDependencies` passed to every planner                     |
| `IBuildOrderInputs` / `IBuildOrderInputsData`       | types              | Typed inputs: `user`, `positionsManager?`, `simulation`                                          |
| `BuildOrderInputsDataSchema` / `isBuildOrderInputs` | Zod schema + guard | Runtime validation of order inputs                                                               |
| `encodeStrategy`                                    | util               | ABI-encodes `executeOp` + `execute` calls into a `TransactionInfo` ready for `IPositionsManager` |
| `encodeForPositionsManager`                         | util               | ABI-encodes a single `execute(address, bytes)` call for the positions manager                    |
| `generateStrategyName`                              | util               | Derives a deterministic strategy name from a refinance/import simulation                         |

## Build, test, and dev commands

Run from the package root or via turbo from the repo root.

```
pnpm build      # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm test       # jest --coverage=true --passWithNoTests
pnpm testw      # jest --watch
pnpm tsc        # type-check only
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
pnpm watch      # tsc -w
```

## Cross-package connections

**Consumes:** `@summerfi/sdk-common`, `@summerfi/armada-protocol-common`,
`@summerfi/protocol-plugins-common`, `@summerfi/protocol-plugins`, `@summerfi/swap-common`,
`@summerfi/address-book-common`, `@summerfi/contracts-provider-common`

**Consumed by:** `order-planner-service` (concrete implementation), `protocol-manager-common`,
`protocol-manager-service`, `sdk-server`

**Gotchas:** The package uses live TypeScript source exports (`./src/*/index.ts`) — there is no
compiled output consumed at dev time. `encodeStrategy` returns `undefined` when the `actions` array
is empty; callers must handle the `Maybe<TransactionInfo>` return. `generateStrategyName` is typed
for `IRefinanceSimulation | IImportSimulation` only — passing other simulation types is a
compile-time error.

SDK reference docs (auto-generated TypeDoc) live in `gitbook/reference`.
