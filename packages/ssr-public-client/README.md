# @summerfi/ssr-public-client

`@summerfi/ssr-public-client` provides a server-side-safe factory for cached [viem](https://viem.sh)
`PublicClient` instances. It builds one client per supported chain on first request, stores it in a
module-level `Map`, and routes all RPC calls through Summer.fi's RPC gateway, constructed from the
`RPC_GATEWAY` environment variable at module-load time.

## Key exports

| Export                         | File                           | Description                                                                                                                                                                                                                 |
| ------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getSSRPublicClient(chainId)`  | `src/get-ssr-public-client.ts` | Returns a `Promise<PublicClient \| undefined>` for the given `SupportedNetworkIds`; throws if the chain is not in `SSRChainConfigs`. **This is the only export re-exported from `src/index.ts` (the package entry point).** |
| `SSRChainConfigs`              | `src/get-ssr-public-client.ts` | Array of `{ chain, chainId, chainName }` entries for the currently supported chains (mainnet, base, arbitrum, sonic, hyperliquid). Not re-exported from `index.ts`.                                                         |
| `SDKChainIdToSSRRpcGatewayMap` | `src/rpc-gateway-ssr.ts`       | Typed `{ [key in SupportedNetworkIds]: string \| undefined }` map of pre-built RPC URLs. Not re-exported from `index.ts`.                                                                                                   |

## Commands

```bash
pnpm build   # tsc -b --preserveWatchOutput (also runs as prebuild)
pnpm dev     # tsc -b --preserveWatchOutput -w (watch mode)
pnpm lint    # eslint *.ts*
pnpm clean   # rm -rf dist
pnpm knip    # dead-code check
```

No test script exists in this package.

## Cross-package connections

**Consumes**

- `@summerfi/app-types` (dev) — `SupportedNetworkIds`, `NetworkNames`, `AppConfigType`
- `@summerfi/app-utils` (runtime) — declared as a runtime dependency in `package.json` but not
  imported anywhere in the package's source files
- `viem` 2.47.1 — `createPublicClient`, `http`, chain definitions

**Consumed by**

- `background-jobs/update-tally-delegates` — imports `getSSRPublicClient` in
  `src/get-sumr-decay-factor.ts`

**Gotchas**

- `RPC_GATEWAY` must be set at server startup. `getRpcGatewayUrl` is called at module-load time
  (top-level `const` assignments in `rpc-gateway-ssr.ts`), so a missing variable produces
  `undefined` URLs that will silently create broken clients; it does not throw until
  `getSSRPublicClient` is called with such a chain.
- Adding a new chain requires two coordinated edits: add the viem chain object to `SSRChainConfigs`
  in `src/get-ssr-public-client.ts` **and** add a corresponding `getRpcGatewayUrl(...)` entry in
  `SDKChainIdToSSRRpcGatewayMap` in `src/rpc-gateway-ssr.ts`. The map is typed
  `[key in SupportedNetworkIds]`, so `SupportedNetworkIds` in `@summerfi/app-types` must be updated
  first or the build will fail.
- The in-process `publicClientsMap` cache is process-scoped; clients survive across requests in the
  same Node.js process but are lost on cold starts (e.g., serverless functions).
