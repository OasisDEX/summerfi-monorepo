# @summerfi/tokens-service

Service-layer implementation of the Summer.fi token resolution system. `@summerfi/tokens-service`
provides `TokensManager` and `TokensManagerFactory` (the concrete server-side classes) backed by
`StaticTokensProvider`, which builds a per-`ChainId` `TokensMap` from the hardcoded token list in
`src/implementation/static/StaticTokensList.ts` (~130 entries across chain IDs). All token metadata
lookups (by symbol, name, or address) are static-only; the injected `blockchainClientProvider` is
used only to query on-chain balances. This package sits in the common/service layering as the
concrete service consumed by `sdk-server` and other server-side packages; interfaces live in
`tokens-common`.

## Key exports

| Export                 | Description                                                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TokensManager`        | Concrete `ITokensManager` — dispatches token queries to registered providers                                                                          |
| `TokensManagerFactory` | Static factory; call `newTokensManager({ configProvider, blockchainClientProvider })` to get a ready-to-use `ITokensManager`                          |
| `StaticTokensProvider` | `ITokensProvider` backed by the hardcoded `StaticTokensList`; supports `getTokenBySymbol`, `getTokenByName`, `getTokenByAddress`, and balance lookups |

## Commands

```bash
pnpm build    # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm test     # jest tests/
pnpm tsc      # type-check only
pnpm lint     # eslint .
pnpm lint:fix # eslint . --fix
```

## Cross-package connections

**Consumes:** `@summerfi/tokens-common` (interfaces), `@summerfi/blockchain-client-common`,
`@summerfi/configuration-provider-common`, `@summerfi/sdk-common`, `@summerfi/sdk-server-common`
(`ManagerProviderBase`)

**Consumed by:** `sdk-server`, `contracts-provider-service`, `testing-utils`

**Gotchas:**

- Token data is static source code, not fetched from a token-list URL. Adding a token or a new chain
  means editing `src/implementation/static/StaticTokensList.ts` directly — append a `TokenData`
  entry (`{ name, address, symbol, decimals, chainId, logoURI }`) under the correct chain comment
  block.
- `TokensProviderType.Static` is currently the only registered provider; `TokensManagerFactory`
  instantiates it unconditionally.
- On-chain calls (via `erc20Abi` + `blockchainClientProvider`) are used only for balance queries
  (`getTokenBalanceBySymbol`, `getTokenBalanceByAddress`); they do not resolve token metadata. All
  metadata lookups — by symbol, name, or address — require a static entry in `StaticTokensList.ts`.

SDK reference docs live in `gitbook/reference`.
