# @summerfi/get-migrations-function

AWS Lambda function (API Gateway HTTP API v2) that returns eligible Aave-like position migrations
for a given wallet address. Given an EVM address it queries Aave v3 and Spark pools across Mainnet,
Arbitrum, Optimism, and Base — resolving both the EOA and any DS Proxy — then returns two response
lists: `migrations` (EOA-only, "legacy") and `migrationsV2` (all eligible positions). The supported
protocol/chain matrix is maintained manually in `src/migrations-config.ts`.

## Key entry points

- **`src/index.ts`** — Lambda `handler`; validates query params (`address`, optional
  `customRpcUrl` + `chainId` pair) via Zod, delegates to `createMigrationsClient`, returns
  `PortfolioMigrationsResponse`.
- **`src/client.ts`** — `createMigrationsClient` factory; iterates the migration config, resolves DS
  Proxy, fetches AAVE pool reserves + user configuration, decodes asset bitmap, and prices assets
  via the AAVE oracle.
- **`src/migrations-config.ts`** — `MigrationConfig` constant (`IMigrationConfig`); hand-maintained
  map of `ChainId -> ProtocolId[]`. Must be edited manually when adding chain or protocol support.
- **`src/addressService.ts`** — thin wrapper over `@oasisdex/addresses` that resolves on-chain
  contract addresses by chain and protocol.

## Build, test, lint

```
pnpm build   # esbuild bundle → dist/index.js (Node 20, minified + sourcemap)
pnpm test    # jest (--passWithNoTests)
pnpm lint    # eslint
pnpm lint:fix
```

No `dev` or `start` script is defined. Deployment is handled outside this package (Dockerfile
present at root).

## Cross-package connections

**Consumes:**

- `@summerfi/serverless-shared` (workspace) — response helpers (`ResponseOk`, `ResponseBadRequest`,
  `ResponseInternalServerError`), validators (`addressSchema`), domain types (`PortfolioMigration`,
  `PortfolioMigrationsResponse`, `ChainId`, `ProtocolId`, etc.), `getRpcGatewayEndpoint`, and
  constants (`USD_DECIMALS`).
- `@oasisdex/addresses` — on-chain contract address registry used by `addressService.ts`.
- `viem` (pinned `2.43.5`) — public client, multicall, contract reads.

**Consumed by:** No other workspace package imports this package directly; it is deployed as a
standalone Lambda.

**Gotchas:**

- `RPC_GATEWAY` must be set — either via the Lambda stage variable
  `event.stageVariables.RPC_GATEWAY` or the environment variable `process.env.RPC_GATEWAY`. The
  handler throws at runtime if it is absent.
- `customRpcUrl` and `chainId` query params must always be provided together (Zod `.refine` enforces
  this).
- Sonic and Hyperliquid are listed in `MigrationConfig` with empty arrays and are explicitly skipped
  in `client.ts`; adding support requires changes in both files plus `addressService.ts`.
- MKR (`0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2`) is hard-coded in `client.ts` as a non-standard
  ERC-20 (bytes32 symbol); update the address if the token ever changes.
- The `build` script produces a single-file bundle with no separate type declarations — there is
  nothing to publish to npm.
