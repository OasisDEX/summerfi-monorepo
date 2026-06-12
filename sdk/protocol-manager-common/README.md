# @summerfi/protocol-manager-common

Shared interface layer for the Summer.fi protocol-manager tier. The package exports two TypeScript
interfaces — `IProtocolManager` and `IProtocolManagerContext` — that define the contract every
protocol-specific manager must satisfy and the context object it receives at construction time. It
contains no runtime logic; all concrete behaviour lives in `protocol-manager-service`.

## Key exports

| Export                    | Description                                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `IProtocolManager`        | Contract for per-protocol managers: `getLendingPool`, `getLendingPoolInfo`, `getLendingPosition`, `getImportPositionTransaction` |
| `IProtocolManagerContext` | Extends `IProtocolPluginContext` from `@summerfi/protocol-plugins-common`; currently has no additional members                   |

Both are re-exported from `src/index.ts` and consumed via the `"."` export map.

## Build & lint commands

```bash
pnpm build       # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm bundle      # esbuild src/index.ts --bundle --minify --platform=node --target=node20 --outfile=dist/index.js --sourcemap
pnpm tsc         # plain tsc (type-check only)
pnpm watch       # tsc -w
pnpm lint        # eslint .
pnpm lint:fix    # eslint . --fix
```

There are no test scripts in this package's `package.json`.

## Cross-package connections

**Consumes (runtime dependencies)**

- `@summerfi/sdk-common` — lending-pool, position, and transaction types used in `IProtocolManager`
- `@summerfi/protocol-plugins-common` — `IProtocolPluginContext`, which `IProtocolManagerContext`
  extends
- `@summerfi/deployment-types` — pulled in as a dependency (transitively required by the above)

**Consumed by**

- `@summerfi/protocol-manager-service` — implements `IProtocolManager` and wires up
  `IProtocolManagerContext`
- `@summerfi/simulator-service` — depends on the shared interface for simulation paths
- `@summerfi/sdk-server` — references the interface when constructing the server-side protocol
  manager

**Gotchas**

- `@summerfi/order-planner-common` is listed only as a `devDependency` and is not imported in
  source; it is present for test/dev tooling alignment only.
- This package has no runtime code and no test suite — there is nothing to bundle separately beyond
  the TypeScript source consumed via the `"."` export map.
- SDK reference docs for these interfaces are generated and published under `gitbook/reference`;
  re-run doc generation after changing interface signatures.
