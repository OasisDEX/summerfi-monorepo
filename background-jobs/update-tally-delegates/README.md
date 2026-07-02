# @summerfi/update-tally-delegates

AWS Lambda background job that synchronises SUMR governance delegate data from the Tally API into
the Summer Protocol database. On each invocation the handler fetches delegates for both governance
V1 (governor `0xBE5A4DD68c3526F32B454fE28C9909cA0601e9Fa`) and V2 (governor
`0x4cEeE1b6289624d381383C1Bb42B118d5f2c3274`) on Base, fetches on-chain smoothed decay factors for
V1 delegate addresses via a batched multicall against the GovernanceRewardsManager
(`0xDe61A0a49f48e108079bdE73caeA56E87FfeEF92`), and upserts the merged records into the
`tallyDelegates` (V1) and `tallyDelegatesV2` (V2) database tables. The `custom_*` database columns
are never overwritten by this job.

## Key entry points

| File                           | Role                                                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `src/index.ts`                 | Lambda `handler` export — orchestrates the full fetch-and-upsert flow                                                                   |
| `src/get-sumr-delegates.ts`    | Paginates Tally GraphQL API (20 delegates per page, 200 ms delay between pages); exports `SumrDelegates` interface                      |
| `src/get-sumr-decay-factor.ts` | Multicalls `calculateSmoothedDecayFactor` on Base in batches of 10 (2 s delay between batches); exports `SumrDecayFactorData` interface |
| `src/update-delegates.ts`      | Connects to the protocol DB via `@summerfi/summer-protocol-db` and runs an insert-on-conflict-update upsert                             |

## Commands

```bash
pnpm build   # tsc -b --preserveWatchOutput -v
pnpm test    # jest --passWithNoTests
pnpm lint    # eslint .
pnpm lint:fix
```

## Cross-package connections

**Consumes**

- `@summerfi/summer-protocol-db` — database client; connection string supplied via
  `EARN_PROTOCOL_DB_CONNECTION_STRING` env var (required at runtime)
- `@summerfi/armada-protocol-abis` — provides `GovernanceRewardsManagerAbi` used in the decay-factor
  multicall
- `@summerfi/ssr-public-client` — viem public client factory for Base RPC calls
- `@summerfi/app-types` — `SupportedNetworkIds` enum (dev dependency)
- Tally GraphQL API at `https://api.tally.xyz/query` — requires `TALLY_API_KEY` env var

**Consumed by**

- Deployed as an AWS Lambda function via SST (see `sst-env.d.ts`); no other workspace package
  imports this package directly.

**Gotchas**

- Both `EARN_PROTOCOL_DB_CONNECTION_STRING` and `TALLY_API_KEY` must be set in the Lambda
  environment. If `EARN_PROTOCOL_DB_CONNECTION_STRING` is absent the handler logs an error and
  returns early before any API calls are made. If `TALLY_API_KEY` is absent, `getSumrDelegates`
  throws an error that is caught by the handler's top-level try/catch, logged, and the handler exits
  without re-throwing.
- Decay factors are only fetched and stored for V1 delegates; `tallyDelegatesV2` rows always have
  `votePower = 0`.
- Bio strings longer than 600 characters are truncated to 597 characters with `...` appended before
  insertion.
- Tally pagination uses cursor-based paging; the loop stops when `lastCursor` is empty or no nodes
  are returned — there is no server-side total count to verify against.
