# @summerfi/summer-earn-protocol-subgraph

GraphQL client library for the Summer Earn Protocol subgraphs. It wraps `graphql-request` with
generated TypeScript types and exposes typed query functions for vaults, user positions, users, and
campaign data across five chains: Base, Arbitrum, Mainnet, Sonic, and Hyperliquid.

## Key exports

- `getAllClients(baseUrl)` — returns a `Record<ChainId, SubgraphClient>` covering all supported
  chains; each client is an SDK instance built from the codegen'd `getSdk`.
- `getVaults`, `getUserPositions`, `getUsersPositions`, `getUsers`, `getCampaignData` — typed
  wrapper functions (from `src/wrappers/`) over the generated SDK.
- `SubgraphClient`, `SubgraphClientConfig`, `Arks`, `Ark`, `VaultsQuery`, `HistoricalVaultsQuery` —
  types exported from `src/types.ts`. Note: `Vault` is used internally in `src/types.ts` but is not
  re-exported; `src/index.ts` does not export from the generated client directly.
- `subgraphNameByChainMap`, `supportedChains` — utility constants (from `src/utils/`).

## Commands

| Script                        | What it runs                                                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm generate`               | Runs `graphql-codegen` (reads `DOTENV_CONFIG_PATH=../../.env`) to regenerate `src/generated/client.ts` from the live schema and `src/queries/queries.graphql` |
| `pnpm tsc`                    | Type-check and emit (runs `tsc` with no extra flags; `noEmit` is not set)                                                                                     |
| `pnpm dev`                    | Incremental watch build via `tsconfig.build.json`                                                                                                             |
| `pnpm test`                   | Jest (`--passWithNoTests`)                                                                                                                                    |
| `pnpm lint` / `pnpm lint:fix` | ESLint                                                                                                                                                        |

Note: `build:disabled` is intentionally disabled; the package is consumed via its `src/` exports
directly (see `exports` in `package.json`).

## Cross-package connections

**Consumes:**

- `@summerfi/serverless-shared` (workspace) — provides `ChainId` enum used throughout.

**Consumed by:**

- `external-api/get-protocol-info-function`
- `external-api/get-campaign-data-function`
- `background-jobs/update-summer-earn-rewards-apr`

**Gotchas:**

- `src/generated/client.ts` is auto-generated and must be re-run via `pnpm generate` after any
  `.graphql` schema or query change. The file includes a `// @ts-nocheck` header and should not be
  edited by hand.
- `pnpm generate` requires a `SUBGRAPH_BASE` env var (set in the root `.env` file at `../../.env`) —
  `codegen.yml` interpolates it as the schema URL base.
- The codegen schema URL in `codegen.yml` points to the Hyperliquid subgraph endpoint; all five
  chain-specific subgraph names are defined in `src/utils/subgraphNameByChainMap.ts` and used at
  runtime via `createClient`.
