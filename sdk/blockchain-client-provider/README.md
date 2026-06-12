# @summerfi/blockchain-client-provider

Implementation of `IBlockchainClientProvider` that creates viem `PublicClient` instances per chain,
routing them through the Summer RPC gateway. At construction time it preloads clients for
`[mainnet, arbitrum, base, sonic, hyperliquid]` using the `SDK_RPC_GATEWAY` env var; URLs are built
by `getRpcGatewayEndpoint`, which appends the `chainIdToGraphChain` network slug and
`skipCache`/`skipMulticall`/`skipGraph`/`source` flags. An optional `rpcUrl` override on
`getBlockchainClient` bypasses the gateway (used for fork testing via `getForkUrl`). The `stage`
field in `rpcConfig` is set to `'PROD'` when `NODE_ENV === 'production'`, `'DEV'` otherwise. Full
SDK reference docs live in `gitbook/reference`.

## Key exports

| Export                     | Description                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `BlockchainClientProvider` | Main class; implements `IBlockchainClientProvider` from `@summerfi/blockchain-client-common`                                               |
| `getRpcGatewayEndpoint`    | Builds a gateway URL string from base URL, chain ID, and RPC config flags (`network`, `skipCache`, `skipMulticall`, `skipGraph`, `source`) |

## Commands

```bash
pnpm build      # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm test       # jest --passWithNoTests
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

## Cross-package connections

**Consumes:** `@summerfi/blockchain-client-common` (interfaces),
`@summerfi/configuration-provider-common` (config reads), `@summerfi/sdk-common` (`hyperliquid`
chain, `chainIdToGraphChain`), `viem` (used directly but not declared in `package.json`; resolved as
a hoisted workspace dependency)

**Consumed by:** `sdk-server`, `allowance-manager-service`, `contracts-provider-service`,
`testing-utils`

**Gotchas:**

- `SDK_RPC_GATEWAY` must be set; the constructor throws `'SDK_RPC_GATEWAY not found'` if it is
  missing.
- The constructor preloads only `[mainnet, arbitrum, base, sonic, hyperliquid]`. Adding a chain ID
  to `sdk-common` `ChainIds` is not sufficient — the viem chain object must also be added to this
  preload list, otherwise `getBlockchainClient` throws `'Chain not supported'`.
- Fork testing uses `SDK_USE_FORK=true` and `SDK_FORK_CONFIG` (a JSON map of `chainId → rpcUrl`),
  parsed by `getForkUrl.ts`.
- This package sits in the common/service layering as the concrete service-side implementation of
  `blockchain-client-common`'s interfaces.
