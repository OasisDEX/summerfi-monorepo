# @summerfi/get-campaign-data-function

AWS Lambda handler that checks OKX campaign quest completion status for a given wallet address. It
queries the Summer earn subgraph for on-chain position data, reads the `delegates` slot of the SUMR
token contract on Base, and cross-references a `campaigns` table in the protocol database to confirm
the wallet arrived via the OKX campaign page.

**Key exports/entry points**

- `src/index.ts` — `handler` (named export; also re-exported as the default): the Lambda entry
  point, validates path parameters, dispatches to the OKX campaign checker.
- `src/campaigns/okx/handler.ts` — `checkOKXQuestsUpTo`: evaluates quests 1–4 sequentially; if any
  quest fails all subsequent quests are short-circuited to `false`.
- `src/db.ts` — `isOkxCampaignWallet`: looks up the wallet in the `campaigns` table via
  `@summerfi/summer-protocol-db`.

**Endpoint**

`GET /api/campaigns/{campaign}/{questNumber}/{walletAddress}`

- `campaign`: `okx` (only supported value)
- `questNumber`: integer 1–4; the handler evaluates all quests up to and including this number
- `walletAddress`: Ethereum address

Response body: `{ code: 0, data: boolean }` — `data` is `true` only if all quests up to
`questNumber` are completed. Append `?debug` to the query string to receive per-quest detail in a
`debug` field.

**Quest criteria (OKX)**

| #   | Condition                                                                   |
| --- | --------------------------------------------------------------------------- |
| 1   | Active position with ≥ 100 USDC/EURC **or** ≥ 0.1 WETH/ETH on Base          |
| 2   | Quest 1 position opened ≥ 7 days ago                                        |
| 3   | Claimed SUMR tokens > 0 (subgraph `claimedSummerTokenNormalized`)           |
| 4   | SUMR staked and delegated (self or third party; `delegates` ≠ zero address) |

**Build / test / lint commands**

```
pnpm build        # tsc -b --preserveWatchOutput -v
pnpm test         # jest --passWithNoTests
pnpm lint         # eslint .
pnpm lint:fix     # eslint . --fix
```

**Cross-package connections**

Consumes:

- `@summerfi/serverless-shared` — `ResponseOk`, `ResponseInternalServerError`, `addressSchema`,
  `ChainId`
- `@summerfi/summer-earn-protocol-subgraph` — `getCampaignData` (subgraph query),
  `OkxQuestDataQuery` type
- `@summerfi/armada-protocol-abis` — `SummerTokenAbi` (used to call `delegates` on the SUMR token at
  `0x194f360D130F2393a5E9F3117A6a1B78aBEa1624` on Base)
- `@summerfi/summer-protocol-db` — `getSummerProtocolDB`, `campaigns` table
- `@aws-lambda-powertools/{logger,metrics,tracer}` — structured logging / observability

No other package in the monorepo imports this package (it is a standalone Lambda deployment
artifact).

Required environment variables at runtime:

| Variable                             | Purpose                                               |
| ------------------------------------ | ----------------------------------------------------- |
| `SUBGRAPH_BASE`                      | URL base for the Base-chain subgraph                  |
| `RPC_GATEWAY`                        | RPC gateway base URL; appended with `?network=base`   |
| `EARN_PROTOCOL_DB_CONNECTION_STRING` | PostgreSQL connection string for `summer-protocol-db` |
