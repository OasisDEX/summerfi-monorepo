# @summerfi/spark-rewards-claim

AWS Lambda handler (`GET /api/spark-rewards-claim`) that looks up claimable Spark SPK airdrop
rewards for an Ethereum address, checks on-chain how much has already been claimed by batching
`cumulativeClaimed` reads via viem's public-client multicall, and returns an unsigned Multicall3
`aggregate3` transaction the caller can submit to claim all outstanding rewards in a single on-chain
call. Rewards data is fetched from the BlockAnalitica Spark2 API and validated against a hard-coded
allowlist of root hashes before any calldata is assembled. Mainnet (`chainId 1`) is the only
supported chain.

## Key exports / entry points

| Path                                           | Description                                                                                                                                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/index.ts` → `handler`                     | Lambda entry point; consumes `?account=<hex>` query param, returns `{ canClaim, cumulativeToClaim, cumulativeClaimed, claimMulticallTransaction, calls }`                                               |
| `src/fetchRewardsData.ts` → `fetchRewardsData` | Hits `spark2-api.blockanalitica.com` and normalises the response into `RewardsData[]`                                                                                                                   |
| `src/mappings.ts`                              | `getRewardsContractAddressByClaimType`, `assertValidRootHash` — hard-coded claim-type → contract address and root-hash allowlist; **must be updated manually when new epochs or claim types are added** |
| `src/enums.ts`                                 | `ClaimType` enum (`PRE_FARMING_AND_SOCIAL`, `SPARK_IGNITION`)                                                                                                                                           |
| `src/types.ts`                                 | `RewardsData`, `SparkRewardsClaim`, `SparkRewardsResponse`                                                                                                                                              |

## Build / test / dev commands

```bash
pnpm build   # tsc -b --preserveWatchOutput -v
pnpm test    # jest --passWithNoTests
pnpm lint    # eslint .
pnpm lint:fix
```

There is no `format:fix` script in this package's `package.json`; run it from the repo root or a
parent workspace if needed.

## Cross-package connections

**Consumes:**

- `@summerfi/serverless-shared` — `getRpcGatewayEndpoint`, `ChainId`, `safeParseBigInt`,
  `ResponseOk/ResponseBadRequest/ResponseInternalServerError`, `addressSchema`

**Who consumes it:**

- `stacks/spark-rewards-claim.ts` — SST stack that registers this handler as
  `GET /api/spark-rewards-claim` and wires it into `stacks/summer-stack.ts`

**Required environment variables (set by the SST stack; missing values cause a 500 at runtime):**

- `RPC_GATEWAY` — base URL for the RPC gateway
- `SUBGRAPH_BASE` — subgraph base URL (imported into env but not yet used by the handler logic)
- `STAGE` — deployment stage passed through from `app.stage`

**Gotchas:**

- Root-hash allowlist in `src/mappings.ts` is hand-maintained; a new Spark epoch will cause
  `assertValidRootHash` to throw until the new hash is added there.
- Contract addresses per claim type are also hard-coded in `mappings.ts`; adding a new `ClaimType`
  enum value requires a corresponding entry in both the `contractAddresses` map and the enum.
- The BlockAnalitica API URL in `fetchRewardsData.ts` includes a hard-coded `ignition_root` and
  `demask_key` — these must be rotated in source if the upstream API credentials change.
