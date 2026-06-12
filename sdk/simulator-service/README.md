# @summerfi/simulator-service

Pure computation layer that runs position simulations for the refinance-lending-to-lending and
import-position flows. It owns the `Simulator` engine (a typed step-machine), two concrete
strategies (`refinanceLendingToLendingAnyPairStrategy`, `importPositionStrategy`), and the shared
`IRefinanceDependencies` interface that wires swap, oracle, and protocol-manager queries together at
runtime. There is no `-common` counterpart; `sdk-server` consumes the implementation package
directly. SDK reference docs live in `gitbook/reference`.

## Key exports / entry points

| Path                                   | What it is                                                                                    |
| -------------------------------------- | --------------------------------------------------------------------------------------------- |
| `dist/index.js`                        | Root barrel (re-exports everything below)                                                     |
| `src/strategies/index.ts`              | `refinanceLendingToLending`, `importPosition` strategy functions and `IRefinanceDependencies` |
| `src/implementation/simulator-engine/` | `Simulator<Strategy, AddedSteps>` – the generic step-machine                                  |
| `src/interfaces/`                      | `ISimulationState`, step/type interfaces                                                      |

## Build / test / dev commands

```bash
pnpm build       # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm tsc         # plain tsc (full compile, emits to dist/)
pnpm watch       # tsc -w
pnpm lint        # eslint .
pnpm lint:fix    # eslint . --fix
```

No `test` script is declared in this package's `package.json`.

## Cross-package connections

**Consumes (runtime dependencies):**

- `@summerfi/sdk-common` — `SimulationSteps`, `SimulationStrategy`, shared types
- `@summerfi/swap-common` — `ISwapManager` (swap quotes at simulation time)
- `@summerfi/oracle-common` — `IOracleManager` (spot prices)
- `@summerfi/protocol-manager-common` — `IProtocolManager` (pool data)
- `@summerfi/protocol-plugins` / `@summerfi/protocol-plugins-common` — declared as dependencies;
  protocol-specific data shapes used by the step processor
- `@summerfi/armada-protocol-common` — declared as a dependency in `package.json`; not imported in
  source files at the time of writing

**Consumed by:**

- `@summerfi/sdk-server` — calls `refinanceLendingToLending` and `importPosition` from this package
  in its tRPC handlers (`getRefinanceSimulation`, `getImportSimulation`)

**Gotchas:**

- There is no `-common` counterpart; `sdk-server` imports the implementation package directly.
- Armada simulation (`getArmadaSimulation` handler in `sdk-server`) is handled by
  `@summerfi/armada-protocol-service`, not this package, despite `armada-protocol-common` appearing
  in `package.json` dependencies.
- The package has no `test` script; tests (if any) run from the monorepo root via turbo.
