# @summerfi/get-protocol-info-function

AWS Lambda handler (`src/index.ts`) that exposes four read-only routes for Summer Earn protocol
data. It queries two subgraph packages for vault/position data and calls on-chain contracts (via
viem multicall) for live reward and circulating-supply figures.

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

**Consumes:**

- `@summerfi/summer-earn-protocol-subgraph` — `getVaults`, `getUsers`, `getUsersPositions`,
  `supportedChains`
- `@summerfi/summer-earn-institutions-subgraph` — `getVaults` (institutional vaults)
- `@summerfi/serverless-shared` — `ResponseOk/BadRequest/InternalServerError`, `chainIdSchema`,
  `Address`, `ChainId`, `isValidAddress`
- `@aws-lambda-powertools/logger`, `/metrics`, `/tracer` — structured Lambda observability

**Required environment variables (runtime):**

- `SUBGRAPH_BASE` — base URL for both subgraph clients; handler returns 500 if absent
- `RPC_GATEWAY` — base URL for viem RPC calls (`?network=<name>` appended); used by `/users` and
  `/circulating-supply`; throws if absent

**Who consumes this package:** No other workspace package imports this package directly; it is
deployed as a standalone Lambda and called over HTTP.

**Gotchas:**

- Supported chains are driven by `supportedChains` from `@summerfi/summer-earn-protocol-subgraph`;
  adding a chain there requires a corresponding `getChainConfig` case in `src/index.ts` and a
  `SUMMER_TOKEN_ADDRESSES` entry.
- The `/circulating-supply` route sources vesting-wallet addresses by scanning on-chain
  `VestingWalletCreated` logs on Base from block 0; this can be slow or hit node rate limits on cold
  calls.
- `GET /users` is deprecated; the handler logs a warning and continues to work but callers should
  migrate to `POST /users`.
