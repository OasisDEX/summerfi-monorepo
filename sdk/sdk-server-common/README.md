# @summerfi/sdk-server-common

Tiny shared base for service implementations in the Summer.fi SDK server layer. It provides the
abstract classes `ManagerWithProvidersBase` and `ManagerProviderBase`, plus the companion interfaces
`IManagerWithProviders` and `IManagerProvider`, which together express the
manager-delegates-to-providers pattern used consistently across the tokens, swap, oracle, and other
services: a manager registers one or more typed providers at construction time and routes requests
to the best one for a given chain.

## Key exports

| Export                     | Kind           | Description                                                                                                       |
| -------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| `ManagerWithProvidersBase` | class          | Base manager that registers providers by chain ID and provider type; exposes `_getBestProvider()` for subclasses. |
| `ManagerProviderBase`      | abstract class | Base provider that stores `type` and `configProvider`; subclasses implement `getSupportedChainIds()`.             |
| `IManagerWithProviders`    | interface      | Contract for a manager that holds a typed provider registry.                                                      |
| `IManagerProvider`         | interface      | Contract for a single provider: `type`, `configProvider`, `getSupportedChainIds()`.                               |

All four are re-exported from the single entry point `src/index.ts`.

## Build, test, and dev commands

```
pnpm build      # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm test       # jest tests/ --coverage=true
pnpm testw      # jest --watch
pnpm tsc        # plain type-check
pnpm watch      # tsc -w
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

## Cross-package connections

**Consumes:** `@summerfi/common`, `@summerfi/sdk-common`, `@summerfi/configuration-provider-common`,
`@summerfi/configuration-provider-mock`.

**Consumed by:** `armada-protocol-service`, `oracle-common`, `oracle-service`,
`subgraph-manager-service`, `swap-common`, `swap-service`, `testing-utils`, `tokens-common`,
`tokens-service`, `sdk-server`.

**Gotcha:** despite the `-server-common` name, the package is also consumed by pure `-common`
packages (`oracle-common`, `swap-common`, `tokens-common`) — the "server" in the name refers to the
manager/provider pattern, not an exclusive server-side runtime boundary.

Full SDK reference docs live in `gitbook/reference`.
