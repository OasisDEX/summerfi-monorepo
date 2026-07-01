# get-protocol-info-function — cross-package dependencies

AWS Lambda serving protocol/vault info. Routes: `GET /` (protocol stats), `GET /users`, `GET /all-users`,
`GET /circulating-supply`, and the vaults routes: `GET /vaults`, `GET /vaults/{chainId}`,
`GET /vaults/{chainId}/{vaultAddress}` (per-vault NAV / TVL / APY).

This file documents what the function depends on **across the monorepo** and, most importantly, the
**"adding a new chain" coupling** — chain/config lists are duplicated across packages and drift silently.

## Data sources & what each provides

| Dependency | Provides | Used by |
|---|---|---|
| `@summerfi/summer-earn-protocol-subgraph` | Public vaults: `getVaults`, `getUsers`, `getUsersPositions`; **`subgraphNameByChainMap`**, **`supportedChains`** | `/`, `/users`, `/all-users`, `/vaults` |
| `@summerfi/summer-earn-institutions-subgraph` | Institutional (v1) vaults: `getVaults`; **`subgraphNameByChainMap`**, **`supportedChains`** | `/`, `/vaults` |
| RWA / institutions **v2** subgraphs (`summer-institutions-v2`, `summer-institutions-v2-base`) | New institutional vaults. Queried directly via `graphql-request` against `${SUBGRAPH_BASE}/<name>` — no typed client (the typed `GetVaults` needs an `institutionId` and omits `dailySnapshots`). Map lives inline in `src/handlers/vaults.ts`. | `/vaults` |
| `@summerfi/redis-cache` (`getRedisInstance`) + `@summerfi/abstractions` (`DistributedCache`) | Response caching (lazy singleton, noop fallback when unset) | `/vaults` |
| `@summerfi/serverless-shared` | `ChainId`, `Address`, `ResponseOk/BadRequest/...`, `chainIdSchema` | all routes |
| `viem` + `src/abis/fleetRewardsManager.ts` | On-chain `earned(...)` multicalls | `/users`, `/circulating-supply` |

## Environment variables

- `SUBGRAPH_BASE` (required) — base host for **all** subgraphs; full URL is `${SUBGRAPH_BASE}/<subgraph-name>`.
- `RPC_GATEWAY` (required for `/users`, `/circulating-supply`) — see `src/utils/rpc.ts`.
- `REDIS_CACHE_URL`, `REDIS_CACHE_USER`, `REDIS_CACHE_PASSWORD`, `STAGE` (optional) — enable Redis caching for
  `/vaults`. When `REDIS_CACHE_URL`/`STAGE` are unset the function uses a noop cache (still works, just uncached).

## Adding a new chain — checklist

Each source has a single source of truth for its chain → subgraph-name mapping; `supportedChains` derives from it.
When a chain is added to one, the others do **not** update automatically. Touch the ones relevant to the routes
you care about:

1. **`ChainId` enum** — the chain must exist in `@summerfi/serverless-shared` (`src/domain-types.ts`) first.
2. **Public vaults** — add `chainId → 'summer-protocol-<chain>'` in
   `packages/summer-earn-protocol-subgraph/src/utils/subgraphNameByChainMap.ts`. `supportedChains` auto-derives.
   Affects `/`, `/users`, `/all-users`, `/vaults`.
3. **Institutional v1** — add `chainId → 'summer-institutions-<chain>'` in
   `packages/summer-earn-institutions-subgraph/src/utils/subgraphNameByChainMap.ts`. Affects `/`, `/vaults`.
4. **Institutional v2 (RWA)** — add `chainId → 'summer-institutions-v2[-<chain>]'` in the
   `rwaSubgraphNameByChainMap` in **`src/handlers/vaults.ts`**. Affects `/vaults`.
   - NB: the earn-protocol app's `rwaSubgraphsMap` (`apps/earn-protocol/app/server-handlers/subgraphs-map.ts`)
     currently has the wrong `-staging` suffix — that map is **not** the reference; this handler's map is.
5. **On-chain paths only** (`/users`, `/circulating-supply`), if the new chain participates:
   - `src/utils/rpc.ts` — add the chain → network-name mapping.
   - `src/index.ts` — add a `case` to `getChainConfig` (viem chain) and an entry in `SUMMER_TOKEN_ADDRESSES`.
6. **Prerequisite**: the corresponding subgraph must actually be deployed and served by `SUBGRAPH_BASE`.

## Notes

- **`/vaults` APY** is computed from `dailySnapshots.pricePerShare` (7d change annualised + raw 24h change),
  matching the earn-protocol UI helpers `get-nav-price-change-24h.ts` / `get-nav-price-change-30d.ts`, **not**
  the subgraph's revenue-based `apr*` fields. See `src/handlers/vaults.ts` and the pure math in `src/utils/nav-apy.ts`.
- **Staleness**: each vault carries a `staleness` object (`src/utils/nav-apy.ts` `computeNavStaleness`). The
  query fetches `_meta { block { number timestamp } }` (same request, no extra call) and staleness is measured
  as `subgraphBlockTimestamp - latestSnapshotTimestamp > threshold` (default 1 day), i.e. against the
  subgraph's own indexed head to avoid clock skew, with a Lambda wall-clock fallback when the subgraph omits a
  block timestamp. Consumers must check `staleness.isStale` before trusting `nav`/`apy`.
- `/vaults` degrades gracefully: each `(source, chain)` subgraph call is isolated in try/catch, so one failing
  subgraph returns an empty slice rather than failing the whole response.
