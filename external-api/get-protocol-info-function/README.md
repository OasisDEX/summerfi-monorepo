# @summerfi/get-protocol-info-function

AWS Lambda handler (`src/index.ts`) that exposes read-only routes for Summer Earn protocol data. It
queries subgraph packages for vault/position data, calls on-chain contracts (via viem multicall) for
live reward and circulating-supply figures, and serves Redis-cached per-vault metrics on `/vaults`.

## Routes

### `GET /` — Protocol stats

Returns aggregate TVL and vault counts plus a per-chain breakdown that splits public and
institutional vaults.

**Response:**

```json
{
  "protocol": { "totalValueLockedUSD": number, "totalVaults": number },
  "chains": [
    {
      "chainId": number,
      "publicVaults":       { "totalValueLockedUSD": number, "totalVaults": number },
      "institutionalVaults":{ "totalValueLockedUSD": number, "totalVaults": number },
      "totalValueLockedUSD": number,
      "totalVaults": number
    }
  ]
}
```

### `GET /all-users`

Returns every unique depositor address across all supported chains. Paginates internally in pages of
5 000; deduplicates across chains before responding.

**Response:** `{ "addresses": string[] }`

### `POST /users` (preferred) · `GET /users` (deprecated)

Returns TVL and SUMMER token reward breakdown for up to 1 000 addresses. Unclaimed rewards are
fetched on-chain via `FleetRewardsManager.earned()`; claimed rewards come from subgraph position
data.

**POST body / GET query parameters:**

- `addresses` — array (POST) or comma-separated string (GET) of EVM addresses; max 1 000
- `chainId` — optional; omit to query all supported chains

**Response:**

```json
{
  "users": [
    {
      "address": string,
      "totalValueLockedUSD": number,
      "rewards": { "unclaimed": number, "claimed": number, "total": number }
    }
  ]
}
```

Reward values are normalised (divided by 10^18).

### `GET /circulating-supply`

Calculates SUMMER circulating supply by subtracting non-circulating tokens (locked vesting wallets
on Base, excluded treasury/foundation/timelock balances on all chains) from the fixed total supply
of 1 billion tokens.

**Response:** `{ "circulatingSupply": string }` (decimal string, 18-decimal formatted)

### `GET /vaults` · `/vaults/{chainId}` · `/vaults/{chainId}/{vaultAddress}`

Returns per-vault metrics — NAV, TVL, APY, and data staleness — across public, institutional (v1),
and institutional v2 (RWA) vaults. `/vaults` covers all supported chains, `/vaults/{chainId}` one
chain, and `/vaults/{chainId}/{vaultAddress}` a single vault (the FleetCommander address).

**Response (`/vaults`, `/vaults/{chainId}`):**

```json
{
  "vaults": [
    {
      "chainId": number,
      "type": "public" | "institutional" | "institutional-v2",
      "vaultAddress": string,
      "name": string | null,
      "inputTokenSymbol": string | null,
      "nav": string | null,        // NAV = pricePerShare (string preserves BigDecimal precision)
      "tvlUSD": number,            // totalValueLockedUSD
      "apy": {
        "nav7dAnnualised": number | null,  // 7d pricePerShare change, annualised (decimal fraction, 0.0487 = 4.87%)
        "nav24hChange": number | null      // 24h pricePerShare change, raw (decimal fraction, 0.0003 = 0.03%)
      },
      "staleness": {
        "isStale": boolean,                  // true if the newest snapshot is missing or older than thresholdSeconds
        "latestSnapshotTimestamp": number | null,  // unix seconds of the newest daily snapshot
        "ageSeconds": number | null,         // how old that snapshot is vs the subgraph's latest indexed block
        "thresholdSeconds": number,          // staleness threshold (default 86400 = 1 day)
        "subgraphBlockNumber": number | null,     // subgraph's latest indexed block (from _meta)
        "subgraphBlockTimestamp": number | null   // its timestamp — the reference "now" used
      }
    }
  ]
}
```

**Response (`/vaults/{chainId}/{vaultAddress}`):** `{ "vault": { /* same shape as above */ } }` —
`404` when no vault matches the address on that chain, `400` for an invalid chainId or address.

Behaviour notes:

- `nav` is the vault's `pricePerShare`. APY is derived from daily NAV snapshots
  (`src/utils/nav-apy.ts`), not the subgraph's revenue-based `apr*` fields; APY fields are `null`
  when a vault has fewer than 2 daily snapshots (e.g. a brand-new vault).
- Consumers should check `staleness.isStale` before trusting `nav`/`apy`. Age is measured against
  the subgraph's latest indexed block timestamp, so comparing `subgraphBlockTimestamp` against your
  own clock additionally detects subgraph indexing lag. Daily snapshots are produced ~once/day, so a
  healthy low-activity vault can sit close to the 1-day threshold.
- Responses are cached in Redis (~5 min TTL, keyed per chain) when `REDIS_CACHE_URL`/`STAGE` are
  configured; otherwise served uncached. Single-vault lookups reuse the per-chain cached list.
- Degrades gracefully: each `(source, chain)` subgraph call is isolated in try/catch, so one failing
  subgraph returns an empty slice rather than failing the whole response.

## Build / test / dev commands

```bash
pnpm build    # tsc -b --preserveWatchOutput -v
pnpm test     # jest --passWithNoTests
pnpm tsc      # type-check only
pnpm watch    # tsc -w
pnpm lint     # eslint .
pnpm lint:fix # eslint . --fix
```

## Cross-package connections

See [CLAUDE.md](./CLAUDE.md) for the full dependency map, the Redis/VPC cross-stack wiring, and the
"adding a new chain" checklist.

**Consumes:**

- `@summerfi/summer-earn-protocol-subgraph` — `getVaults`, `getUsers`, `getUsersPositions`,
  `supportedChains`
- `@summerfi/summer-earn-institutions-subgraph` — `getVaults` (institutional v1 vaults)
- RWA / institutions v2 subgraphs — queried directly via `graphql-request` with an inline chain →
  subgraph-name map in `src/handlers/vaults.ts` (no typed client)
- `@summerfi/redis-cache` (`getRedisInstance`) + `@summerfi/abstractions` (`DistributedCache`) —
  best-effort response caching for `/vaults` against the SST-managed ElastiCache
- `@summerfi/serverless-shared` — `ResponseOk/BadRequest/InternalServerError`, `chainIdSchema`,
  `Address`, `ChainId`, `isValidAddress`
- `@aws-lambda-powertools/logger`, `/metrics`, `/tracer` — structured Lambda observability

**Required environment variables (runtime):**

- `SUBGRAPH_BASE` — base URL for all subgraph clients; handler returns 500 if absent
- `RPC_GATEWAY` — base URL for viem RPC calls (`?network=<name>` appended); used by `/users` and
  `/circulating-supply`; throws if absent
- `REDIS_CACHE_URL`, `STAGE` — optional; enable Redis caching for `/vaults`. Wired by
  `stacks/partners-stack.ts` from the `API` stack's ElastiCache in staging/prod; when unset the
  handler falls back to a noop cache (uncached but functional)

**Who consumes this package:** No other workspace package imports this package directly; it is
deployed as a standalone Lambda and called over HTTP.

**Gotchas:**

- Supported chains are driven by `supportedChains` from `@summerfi/summer-earn-protocol-subgraph`;
  adding a chain there requires a corresponding `getChainConfig` case in `src/index.ts` and a
  `SUMMER_TOKEN_ADDRESSES` entry. The RWA v2 map in `src/handlers/vaults.ts` is a separate,
  manually-maintained list — see the CLAUDE.md checklist.
- `/vaults` reuses the ElastiCache created by the `API` stack (`stacks/redis.ts`), pulled
  cross-stack with SST `use(API)`, so the `ExternalAPI` stack deploys after `API` and the Lambda
  runs inside the VPC.
- The `/circulating-supply` route sources vesting-wallet addresses by scanning on-chain
  `VestingWalletCreated` logs on Base from block 0; this can be slow or hit node rate limits on cold
  calls.
- `GET /users` is deprecated; the handler logs a warning and continues to work but callers should
  migrate to `POST /users`.
