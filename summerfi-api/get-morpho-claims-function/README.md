# @summerfi/get-morpho-claims-function

AWS Lambda handler that fetches and aggregates Morpho protocol reward claims for a given wallet
address. It calls two Morpho rewards API endpoints (`/v1/users/{account}/rewards` and
`/v1/users/{account}/distributions`) in parallel, aggregates claimable/claimed/accrued amounts per
reward token filtered by the requested supply or borrow claim type, and returns both the raw
claimable entries (with Merkle proofs for on-chain claiming, unfiltered by claim type) and the
aggregated totals. Supported chains are Ethereum mainnet (chain ID 1) and Base (chain ID 8453).

## Key exports / entry points

- `src/index.ts` — `handler` (default export): AWS Lambda `APIGatewayProxyEventV2` handler;
  validates query params `account` (address), `chainId`, and `claimType` (`supply` | `borrow`) via
  Zod, then delegates to `getClaims`.
- `src/get-claims.ts` — `getClaims`: core async function; accepts `GetClaimsParams` and returns
  `MorphoClaims` (`claimable[]`, `claimsAggregated[]`, optional `error`).
- `src/types.ts` — shared types and enums (`MetaMorphoClaims`, `MorphoClaims`,
  `ClaimableMorphoReward`, `MorphoAggregatedClaims`, `GetClaimsParams`).

## Commands

```bash
pnpm build   # tsc -b --preserveWatchOutput -v
pnpm test    # jest --passWithNoTests
pnpm lint    # eslint .
pnpm lint:fix
```

## Cross-package connections

**Consumes:**

- `@summerfi/serverless-shared` (workspace) — `ResponseOk`, `ResponseBadRequest`,
  `ResponseInternalServerError`, `addressSchema`, `chainIdSchema`, `ChainId`, `safeParseBigInt`,
  `Address`.

**Required environment variable:**

- `RPC_GATEWAY` — must be set at Lambda runtime; the handler returns HTTP 500 if absent (the value
  is checked but not forwarded to `getClaims` — it is not used in the current fetch calls to
  `rewards.morpho.org`).

**External API dependency:**

- `https://rewards.morpho.org` — no auth token required; the function hard-codes the base URL.

**Gotcha:**

- Rewards for token address `0x039b598c6b99e70058e1e9021e000bdacd33d026` are silently skipped
  (legacy Morpho token, explicitly excluded in `getClaims`).
- `claimable` entries in the response are wallet-wide, not filtered by `claimType`; only
  `claimsAggregated` reflects the requested supply/borrow split.
