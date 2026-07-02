# @summerfi/protocol-plugins-common

Interface and base-class layer for the Summer.fi protocol plugin system. The package defines the
contracts every protocol plugin must satisfy — `IProtocolPlugin`, `IProtocolPluginContext` (which
wires together provider, token, oracle, swap, and address-book managers),
`IProtocolPluginsRegistry`, `IActionBuilder`/`IStepBuilderContext`, and the
`BaseAction`/`SkippedAction` action base classes — plus the action-storage and input-slot mapping
types that drive step serialisation. It sits at the common/interface layer of the SDK, containing no
runtime business logic of its own.

## Key exports (`src/index.ts`)

| Export                                                               | Kind       | Description                                                             |
| -------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| `IProtocolPlugin`                                                    | interface  | Contract every protocol plugin implementation must fulfil               |
| `IProtocolPluginContext`                                             | interface  | Aggregates provider, tokens, oracle, swap, and address-book managers    |
| `IProtocolPluginsRegistry`                                           | interface  | Registry of all registered protocol plugins                             |
| `IActionBuilder` / `IStepBuilderContext`                             | interfaces | Step-building contracts used during order planning                      |
| `BaseAction` / `SkippedAction`                                       | classes    | Base action implementations for concrete action classes                 |
| `ActionCallsStack` / `StepBuilderContext` / `ExecutionStorageMapper` | classes    | Runtime context helpers for building and serialising action call stacks |
| `ActionCall`, `ActionConfig`, `ActionVersion`, …                     | types      | Action-level types used across planning and simulation                  |
| `StorageAliasMap`, `StepInputsType`, …                               | types      | Storage-slot types for step I/O mapping                                 |
| `IContractProvider`                                                  | interface  | Contract for protocol contract providers                                |
| `InputSlotsMapping`                                                  | type       | Input-slot mapping type for step serialisation                          |

## Build / dev commands

```bash
pnpm build    # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm tsc      # tsc (type-check only)
pnpm watch    # tsc -w
pnpm lint     # eslint .
pnpm lint:fix # eslint . --fix
```

There are no test scripts in this package; testing is handled by downstream packages.

## Cross-package connections

**Consumes:** `@summerfi/sdk-common`, `@summerfi/address-book-common`,
`@summerfi/blockchain-client-common`, `@summerfi/oracle-common`, `@summerfi/swap-common`,
`@summerfi/tokens-common`, `@summerfi/deployment-types`

**Consumed by:** `protocol-plugins` (concrete implementations),
`protocol-manager-common`/`-service`, `order-planner-common`/`-service`, `testing-utils`,
`sdk-server`, `tools/genStrategyDefinitions`

**Gotchas:** This package is source-only (exports point directly to `src/index.ts`); consumers must
compile it as part of their own build — running `pnpm build` here emits declaration files via
`tsconfig.build.json` but the package is not bundled. No environment variables or codegen steps are
required.

SDK reference docs live in `gitbook/reference`.
