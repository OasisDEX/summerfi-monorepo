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

## Cross-package connections

**Consumes:** `@summerfi/serverless-shared` (`ResponseOk`, `ResponseInternalServerError`,
`addressSchema`, `ChainId`), `@summerfi/summer-earn-protocol-subgraph` (`getCampaignData` query,
`OkxQuestDataQuery` type), `@summerfi/armada-protocol-abis` (`SummerTokenAbi` — used to call
`delegates` on the SUMR token at `0x194f360D130F2393a5E9F3117A6a1B78aBEa1624` on Base),
`@summerfi/summer-protocol-db` (`getSummerProtocolDB`, `campaigns` table). Also
`@aws-lambda-powertools/{logger,metrics,tracer}` for observability. Build tooling only:
`@summerfi/eslint-config`, `@summerfi/typescript-config`.

**Consumed by:** nothing in the monorepo — leaf package. It is a standalone Lambda deployment
artifact; the only consumer is SST, which wires it in `stacks/partners-stack.ts` as the
`get-campaign-data` `Function` (handler `external-api/get-campaign-data-function/src/index.handler`)
mounted on the partner gateway route `GET /api/campaigns/{campaign}/{questNumber}/{walletAddress}`
(gateway.summer.fi / gateway.staging.summer.fi).

**Gotchas:**

- Env vars are injected by `stacks/partners-stack.ts` (`ExternalAPI`), not `turbo.json`. All three
  are validated with explicit `throw`s at deploy time in that stack:

  | Variable                             | Purpose                                                       |
  | ------------------------------------ | ------------------------------------------------------------ |
  | `SUBGRAPH_BASE`                      | URL base for the Base-chain earn subgraph                    |
  | `RPC_GATEWAY`                        | RPC gateway base URL; the handler appends `?network=base`    |
  | `EARN_PROTOCOL_DB_CONNECTION_STRING` | PostgreSQL connection string for `summer-protocol-db`        |

- The function runs **inside the VPC** on staging/prod (private subnets) purely to reach the
  VPC-internal Postgres that `EARN_PROTOCOL_DB_CONNECTION_STRING` points at; `SUBGRAPH_BASE` /
  `RPC_GATEWAY` stay reachable via NAT egress. On dev stages there is no VPC (the `...(vpc && …)`
  spread is skipped).
- `@summerfi/summer-earn-protocol-subgraph` codegen **introspects the live endpoint** at build time
  (`${SUBGRAPH_BASE}/<subgraph-name>`), so its generated `getCampaignData` client is only as current
  as the last `pnpm generate` run in that package — a schema change to the OKX quest fields must be
  regenerated and committed there, not here.
- SUMR token address `0x194f360D130F2393a5E9F3117A6a1B78aBEa1624` (Base) is **hardcoded** in
  `src/campaigns/okx/`; it is not resolved from the address book. If the token migrates, update it
  here.
- Quest evaluation short-circuits: `checkOKXQuestsUpTo` (`src/campaigns/okx/handler.ts`) stops at the
  first failing quest, so a later quest never runs once an earlier one is `false`.
