# @summerfi/sdk-client

Typed TypeScript client over the tRPC API exposed by `@summerfi/sdk-server`. The package creates a
`TRPCClient<SDKAppRouter>` via `rpc/SDKMainClient.ts` using a `splitLink`: queries whose estimated
URL length is under 3 000 characters go as GET batch requests; longer queries and all mutations go
as POST batch requests. `SerializationService` from `@summerfi/sdk-common` is used as the tRPC
transformer. Both link variants call `fetch` with `credentials: 'omit'` and forward optional
`Client-Id` and `Insti-Version` headers.

## Key exports / entry points

| Export                 | Description                                                                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `makeSDK(params)`      | Creates a public `SDKManager`. Accepts `apiDomainUrl` (builds `/sdk/trpc/<version>`) or a direct `apiURL`; `version` defaults via `getApiVersion`.                                |
| `makeInstiSdk(params)` | Creates an `SDKInstiManager` for institutional deployments (forwards `instiVersion` header).                                                                                      |
| `makeAdminSDK(params)` | Creates an admin-scoped `SDKInstiManager`. Sends `clientId` as `Client-Id` header and hard-codes `instiVersion: 'v1'`. Returns the same `SDKInstiManager` type as `makeInstiSdk`. |
| `SDKManager`           | Top-level facade: `.chains`, `.tokens`, `.users`, `.dca`, `.armada`, `.swaps`, `.oracle`, `.intentSwaps`, `.allowance`.                                                           |
| Interface types        | `ISDKManager`, `IArmadaManagerClient`, `IDcaManagerClient`, `IAllowanceManagerClient`, etc. from `src/interfaces/`.                                                               |

Each manager in `src/implementation/` implements a corresponding `I*` interface from
`src/interfaces/` and extends the abstract `IRPCClient` base class (from
`src/interfaces/IRPCClient.ts`), calling `this.rpcClient.<namespace>.<proc>.query/mutate`. The `I*`
interfaces themselves are plain TypeScript interfaces and do not extend `IRPCClient`.

## Build / test commands

```
pnpm build          # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm test           # jest --coverage=true
pnpm watch          # tsc -w
pnpm bundle:npm     # esbuild bundle + declaration emit (pre-publish step)
pnpm publish:npm    # bundle:npm then npm publish from bundle/
pnpm lint           # eslint .
pnpm lint:fix       # eslint . --fix
```

## Cross-package connections

**Consumes:** `@summerfi/sdk-common` (SerializationService, types), `@summerfi/sdk-server`
(SDKAppRouter type), `@summerfi/armada-protocol-common`, `@summerfi/armada-protocol-service`,
`@summerfi/armada-protocol-abis`, `@summerfi/subgraph-manager-common`, `@summerfi/protocol-plugins`.

**Consumed by:** `sdk-client-react`, `sdk-e2e`, `sdk-speed-test`, and frontend apps outside `sdk/`.

**Gotchas:**

- This package is published to npm as `@summer_fi/sdk-client` (underscore, not hyphen) via
  `bundle:npm` / `publish:npm`. The workspace package name is `@summerfi/sdk-client` (private) but
  `bundle/package.json` carries the published name. It bundles types from `@summerfi/sdk-server`, so
  any breaking type change in the server leaks into the published client.
- `makeSDK` requires either `apiDomainUrl` or `apiURL` — providing neither throws at runtime.
- To add a new SDK service: create a plain `I*` interface in `src/interfaces/`, then a client class
  in `src/implementation/` that implements the interface and extends the `IRPCClient` abstract
  class. Wire it onto `SDKManager` in `src/implementation/SDKManager.ts` and expose it from
  `src/implementation/MakeSDK.ts`.

The package sits at the common/service boundary: `sdk-common` provides shared serialization and
types; `sdk-server` owns the tRPC router; this package is the sole consumer-facing client layer. SDK
reference docs live in `gitbook/reference`.
