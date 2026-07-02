# @summerfi/protocol-manager-service

`@summerfi/protocol-manager-service` is the server-side implementation of `IProtocolManager`
(defined in `protocol-manager-common`). It instantiates `ProtocolManager` via
`ProtocolManager.createWith({ pluginsRegistry })`, validates incoming lending-pool and position
identifiers, and dispatches queries (`getLendingPool`, `getLendingPoolInfo`) and import-position
transactions to the appropriate protocol plugin looked up from the registry. It sits in the
common/service layering as the concrete service layer backing the router's `protocols` namespace in
`sdk-server`.

## Key exports

| Export            | Description                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `ProtocolManager` | Concrete class; use the static `createWith({ pluginsRegistry: IProtocolPluginsRegistry })` factory — the constructor is sealed. |

Entry point: `src/index.ts`.

## Build commands

| Script   | Command                                                                                     |
| -------- | ------------------------------------------------------------------------------------------- |
| `build`  | `pnpm build` — emits declarations via `tsc -b --preserveWatchOutput -v tsconfig.build.json` |
| `bundle` | `pnpm bundle` — esbuild bundle for Node 20 to `dist/index.js`                               |
| `watch`  | `pnpm watch` — TypeScript watch mode (`tsc -w`)                                             |
| `lint`   | `pnpm lint` / `pnpm lint:fix`                                                               |

There is no `test` script in `package.json`; tests (`tests/ProtocolManager.spec.ts`) must be run via
the workspace test runner or directly with `jest`.

## Cross-package connections

**Consumes**

- `@summerfi/protocol-manager-common` — `IProtocolManager` interface this class implements
- `@summerfi/protocol-plugins-common` — `IProtocolPluginsRegistry` used for plugin lookup
- `@summerfi/protocol-plugins` — concrete plugin implementations (runtime dependency)
- `@summerfi/sdk-common` — shared ID types, guards (`isLendingPoolId`, `isPositionId`), and value
  types
- `@summerfi/deployment-types` — pulled in as a dependency (used transitively by plugins)
- `@summerfi/order-planner-common` — dev/test dependency

**Consumed by**

- `@summerfi/sdk-server` — wires `ProtocolManager` into the server router
- `@summerfi/sdk-e2e` — declares the dependency in `package.json` but no longer imports it in source
  (stale entry)

**Gotchas**

- `getLendingPosition` and `getImportPositionTransaction` throw `Error('Not implemented')` — callers
  in `sdk-server` must not rely on these methods at runtime.
- Plugin lookup is by `protocol.name`; if a required plugin is absent from the registry passed to
  `createWith`, calls throw at runtime with no compile-time guard.

SDK reference docs live in `gitbook/reference`.
