# @summerfi/get-meta-morpho-details-function

AWS Lambda handler (`APIGatewayProxyEventV2`) that accepts a Meta Morpho vault address and optional
token price query parameters, fetches vault allocations from the Morpho Blue external API, then
reads on-chain reward-emission rates via multicall against the `EmissionDataProvider` and
`MorphoBlue` contracts on Ethereum mainnet, and returns per-market and aggregate reward APYs for
Morpho, wstETH, SWISE, and USDC.

## Key exports / entry points

| Export                                                 | File                 | Description                                                                                              |
| ------------------------------------------------------ | -------------------- | -------------------------------------------------------------------------------------------------------- |
| `handler` (default)                                    | `src/index.ts`       | Lambda entry point; validates query params with Zod, orchestrates API + on-chain calls                   |
| `getRewards`                                           | `src/get-rewards.ts` | Multicall helper; reads `rewardsEmissions` from `EmissionDataProvider` and market data from `MorphoBlue` |
| `RewardToken`, `RewardsByMarket`, `GetRewardsResponse` | `src/index.ts`       | TypeScript response interfaces                                                                           |
| ABI exports                                            | `src/abis/index.ts`  | `morphoBlueAbi`, `morphoEmissionDataProviderAbi`                                                         |

## Build / test / dev commands

All commands are run from this package directory or via turbo from the repo root.

```
pnpm build    # tsc -b --preserveWatchOutput -v
pnpm test     # jest --passWithNoTests
pnpm lint     # eslint .
pnpm lint:fix # eslint . --fix
```

## Cross-package connections

**Consumes:**

- `@summerfi/morpho-blue-external-api-client` (workspace) — `getMorphoBlueApiClient` /
  `.allocations()` to retrieve vault allocation data from the Morpho Blue external API.
- `@summerfi/serverless-shared` (workspace) — `ResponseOk`, `ResponseBadRequest`,
  `ResponseInternalServerError`, `getRpcGatewayEndpoint`, `Address`, `ChainId`, `IRpcConfig`, and
  Zod validators (`addressSchema`, `chainIdSchema`, `bigIntSchema`, `urlOptionalSchema`).

**Consumed by:** No other workspace package lists this package as a dependency. It is deployed as a
standalone Lambda function.

**Environment variables (required at runtime):**

- `RPC_GATEWAY` — base URL for the RPC gateway; the handler returns HTTP 500 if absent. A custom RPC
  URL can be passed per-request via the `rpc` query parameter to override the gateway endpoint.

**Hardcoded mainnet addresses:** `EmissionDataProvider`, `MorphoBlue`, `MorphoOperator`, and all
URD/token addresses are compiled into `src/get-rewards.ts`; updating reward programs requires
editing that file directly — there is no codegen or config file.

**Token price parameters:** The handler accepts both a new (`price_MORPHO`, `price_WSTETH`,
`price_SWISE`, `price_USDC`) and a legacy (`morhoPrice`, `wsEthPrice`, `swisePrice`, `usdcPrice`)
set of query-string names for the same four token prices; APY calculation is skipped (returns 0) for
any token whose price is omitted.
