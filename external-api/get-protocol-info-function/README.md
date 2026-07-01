# Protocol Info API Endpoints

## Get All Users
Retrieves all user addresses that have interacted with the protocol across all supported chains.

**Endpoint:** `/all-users`  
**Method:** GET

**Response:**
```json
{
  "addresses": string[]  // Array of Ethereum addresses
}
```

## Get Users Details
Retrieves detailed information about specific users including their positions, TVL, and rewards.

**Endpoint:** `/users`  
**Method:** POST (preferred) or GET (deprecated)

**Request Body (POST):**
```json
{
  "addresses": string[],  // Array of Ethereum addresses
  "chainId": number      // Optional: Specific chain ID to query
}
```

**Query Parameters (GET - deprecated):**
- `addresses`: Comma-separated list of Ethereum addresses
- `chainId`: (Optional) Specific chain ID to query

**Response:**
```json
{
  "users": [
    {
      "address": string,
      "totalValueLockedUSD": number,
      "rewards": {
        "unclaimed": number,
        "claimed": number,
        "total": number
      }
    }
  ]
}
```

## Get Protocol Stats
Retrieves overall protocol statistics.

**Endpoint:** `/`  
**Method:** GET

**Query Parameters:**
- `chainId`: (Optional) Specific chain ID to query

**Response:**
```json
{
  "protocol": {
    "totalValueLockedUSD": number,
    "totalVaults": number
  }
}
```

## Get Vaults
Retrieves per-vault metrics — NAV, TVL, and APY — across public, institutional (v1), and institutional v2
(RWA) vaults.

**Endpoints:** (all GET)
- `/vaults` — all vaults across all supported chains
- `/vaults/{chainId}` — all vaults on a specific chain
- `/vaults/{chainId}/{vaultAddress}` — a single vault

**Path Parameters:**
- `chainId`: numeric chain ID (e.g. `8453` for Base). Must be a supported chain.
- `vaultAddress`: the vault (FleetCommander) address.

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

**Response (`/vaults/{chainId}/{vaultAddress}`):**
```json
{ "vault": { /* single vault object, same shape as above */ } }
```
Returns `404` when no vault matches the address on that chain; `400` for an invalid chainId or address.

**Notes:**
- `nav` is the vault's `pricePerShare`. APY is derived from daily NAV snapshots, not the subgraph's revenue-based `apr*` fields.
- APY fields are `null` when a vault has fewer than 2 daily snapshots (e.g. a brand-new vault).
- **Staleness:** consumers should check `staleness.isStale` before trusting `nav`/`apy`. Age is measured against the subgraph's latest indexed block timestamp (`subgraphBlockTimestamp`), so it also reflects the subgraph's own view of "now" — compare `subgraphBlockTimestamp` against your clock to additionally detect subgraph indexing lag. Daily snapshots are produced ~once/day, so a healthy low-activity vault can sit close to the 1-day threshold.
- Responses are cached in Redis (~5 min TTL, keyed per chain) when `REDIS_CACHE_URL`/`STAGE` are configured; otherwise served uncached. Single-vault lookups reuse the per-chain cached list.

## Notes
- All monetary values are normalized and represented in USD
- Rewards values are normalized (divided by 10^18)
- The API supports multiple chains. If no chainId is specified, it will query all supported chains
- Maximum page size for queries is 1000 items