# @summerfi/blockchain-client-common

Defines the read-only blockchain client contracts used across the Summer.fi SDK. It exports two
TypeScript types: `IBlockchainClient` (a type alias for viem's `PublicClient`) and
`IBlockchainClientProvider` (a factory interface whose `getBlockchainClient` method resolves an
`IBlockchainClient` for a given chain, with an optional `rpcUrl` override for fork targets). This
package is a _common_ (interface-only) layer; the concrete implementation lives in
`blockchain-client-provider`.

## Key exports

| Export                      | Description                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `IBlockchainClient`         | Type alias for viem `PublicClient` — the per-chain read client                      |
| `IBlockchainClientProvider` | Factory interface: `getBlockchainClient({ chainInfo, rpcUrl? }): IBlockchainClient` |

Both are re-exported from `src/index.ts` as type-only exports.

## Commands

```bash
pnpm build    # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm test     # jest --passWithNoTests
pnpm tsc      # type-check only
pnpm lint     # eslint .
pnpm lint:fix # eslint . --fix
```

## Cross-package connections

**Consumes:** `@summerfi/sdk-common` (for `IChainInfo` used in `IBlockchainClientProvider`).

**Consumed by:** `blockchain-client-provider` (implementation), `allowance-manager-service`,
`armada-protocol-service`, `contracts-provider-common`, `contracts-provider-service`,
`protocol-plugins-common`, `swap-service`, `testing-utils`, `tokens-service`, `sdk-server`.

**Gotchas:**

- The implementation counterpart is `blockchain-client-provider` — note there is no `-service`
  suffix, unlike most other service packages.
- This package ships no runtime code; consumers import interfaces only.

SDK reference docs live in `gitbook/reference`.
