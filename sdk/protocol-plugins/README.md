# @summerfi/protocol-plugins

Concrete lending-protocol plugins for the Summer.fi SDK. Each plugin under
`src/plugins/{aave-v3,maker,morphoblue,spark}` bundles the ABI maps, on-chain action encoders,
step-level action builders, and lending-pool/position implementations for one protocol. The shared
base classes (`BaseProtocolPlugin`, `BaseActionBuilder`, `ProtocolPluginsRegistry`) live in
`src/implementation/`. The registration map that wires a `ProtocolName` key to a plugin constructor
is `src/plugins/ProtocolPluginsRecord.ts`. Interfaces for the plugin context (provider,
tokens/oracle/swap/addressBook managers) are defined in `@summerfi/protocol-plugins-common`; this
package is the concrete layer that implements them.

## Key exports

| Export                                                                                       | File                                            | Notes                                                                                                                                                           |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProtocolPluginsRecord`                                                                      | `src/plugins/ProtocolPluginsRecord.ts`          | Registration map keyed by `ProtocolName`                                                                                                                        |
| `ProtocolPluginsRegistry`                                                                    | `src/implementation/ProtocolPluginsRegistry.ts` | Instantiates and initialises a plugin for a given `ProtocolName`                                                                                                |
| `AaveV3ProtocolPlugin`, `SparkProtocolPlugin`, `MakerProtocolPlugin`, `MorphoProtocolPlugin` | `src/plugins/<name>/implementation/`            | Per-protocol plugin classes                                                                                                                                     |
| `AaveV3StepBuilders`, `SparkStepBuilders`, `MorphoStepBuilders`                              | `src/plugins/<name>/builders/`                  | Aggregated builder maps consumed by order-planner (`MakerStepBuilders` lives in `src/plugins/maker/implementation/` and is not exported from the package index) |
| Common actions (`FlashloanAction`, `SwapAction`, etc.)                                       | `src/plugins/common/actions/`                   | Shared across protocols                                                                                                                                         |

## Commands

```
pnpm build          # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm tsc            # plain tsc (type-check)
pnpm watch          # tsc -w
pnpm lint           # eslint .
pnpm lint:fix       # eslint . --fix
pnpm declarations   # emit declaration files only (tsconfig.bundle.json)
```

There is no `test` script in `package.json`.

## Cross-package connections

**Consumes:** `@summerfi/protocol-plugins-common` (interfaces + context types),
`@summerfi/sdk-common` (`ProtocolName` enum), `@summerfi/abis`, `@summerfi/address-book-common`,
`@summerfi/oracle-common`, `@summerfi/swap-common`, `@summerfi/tokens-common`,
`@summerfi/deployment-types`, `@summerfi/deployment-utils`.

**Consumed by:** `sdk-server` (builds the registry in
`src/context/CreateProtocolPluginsRegistry.ts`), `protocol-manager-service` (dispatches
`getLendingPool`/`getLendingPoolInfo`/`getLendingPosition`/`getImportPositionTransaction` through
the registry), `order-planner-common`/`order-planner-service`, `simulator-service`, `sdk-client`,
`sdk-client-react`, `sdk-e2e`.

**Gotchas:**

- Adding a new plugin requires two edits: register the class in `ProtocolPluginsRecord.ts` AND add
  the protocol name to the `ProtocolName` enum in `@summerfi/sdk-common`. See
  `sdk/docs/ADD_NEW_PLUGIN.md` for the full step-by-step guide.
- The `sdk-server` registry is constructed with an Ethereum Mainnet blockchain client only; plugins
  that need multi-chain contexts will not work out of the box via that path.
- `sdk-server` picks up `ProtocolPluginsRecord` directly — there is no codegen step, but a build
  (`pnpm build`) must be re-run after any change to source files before dependent services see
  updated types.

SDK reference docs live in `gitbook/reference`.
