# @summerfi/tokens-common

Interface-only package that defines the contract between the tokens service and the rest of the SDK.
It exports `ITokensManager` (the manager surface consumed by service callers) and `ITokensProvider`
(the per-provider interface implemented by concrete token data sources). Both interfaces follow the
common/service layering convention: `ITokensManager` extends `IManagerWithProviders` from
`@summerfi/sdk-server-common`, and `ITokensProvider` extends `IManagerProvider` from the same
package. Full reference docs live in `gitbook/reference`.

## Key exports

| Export            | File                                | Description                                                                                                                         |
| ----------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `ITokensManager`  | `src/interfaces/ITokensManager.ts`  | Manager interface: `getTokenBySymbol`, `getTokenByAddress`, `getTokenByName`, `getTokenBalanceBySymbol`, `getTokenBalanceByAddress` |
| `ITokensProvider` | `src/interfaces/ITokensProvider.ts` | Provider interface: same token-lookup methods plus `getSupportedChainIds`                                                           |

## Commands

```bash
pnpm build       # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm tsc         # plain tsc (type-check)
pnpm watch       # tsc -w
pnpm lint        # eslint .
pnpm lint:fix    # eslint . --fix
```

There is no `test` script in `package.json`.

## Cross-package connections

**Consumes:** `@summerfi/sdk-common` (core types: `IChainInfo`, `IAddress`, `IToken`,
`ITokenAmount`, `TokensProviderType`, `ChainId`), `@summerfi/sdk-server-common`
(`IManagerWithProviders`, `IManagerProvider`).

**Consumed by:** `tokens-service`, `armada-protocol-service`, `contracts-provider-service`,
`order-planner-service`, `protocol-plugins`, `protocol-plugins-common`, `swap-service`,
`testing-utils`, `sdk-server`.

**Gotchas:** This package contains no runtime code — only TypeScript interfaces. Any change to
`ITokensManager` or `ITokensProvider` must be implemented in every consuming package that provides a
concrete class. There are no codegen steps, env vars, or build-order constraints beyond the standard
workspace dependency graph.
