# @summerfi/app-risk

Shared wallet-risk screening library for the Summer.fi frontend. It integrates with the
[TRM Labs](https://www.trmlabs.com/) screening API to flag wallet addresses that have risk
indicators with a total volume above $100 USD. Risk results are persisted in a Kysely-managed
`walletRisk` table and cached for 14 days; wallets already flagged as risky are re-checked on every
request so provider corrections are reflected quickly.

## Key exports

| Export      | Kind                                | Description                                                                                                                                                |
| ----------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getRisk`   | Server (Next.js App Router handler) | Core route handler — takes `{ req, trmApiKey, db, jwtSecret }`, validates the request JWT cookie, queries/updates the DB, calls TRM, returns `{ isRisky }` |
| `useRisk`   | React hook (`'use client'`)         | Takes `{ chainId, walletAddress, cookiePrefix, host? }`, calls `/api/risk`, and returns `{ isRisky, isLoading, error }`                                    |
| `fetchRisk` | Async function                      | Promise-based variant of `useRisk` for non-hook contexts                                                                                                   |
| `RiskState` | Type                                | Public type contract exported from the package index; extends `RiskResponse` with `isLoading`                                                              |

## Commands

```bash
pnpm build      # vite build -w false
pnpm dev        # vite build -w true
pnpm lint       # eslint *.ts*
pnpm clean      # rm -rf dist
pnpm knip       # unused-export analysis
```

## Cross-package connections

**Consumes**

- `@summerfi/app-utils` (peer) — `verifyAccessToken` used inside `getRisk` to authenticate the JWT
  cookie
- `kysely` (peer) — DB access; callers must supply a `Kysely<DB>` instance where
  `DB extends RiskRequiredDB` (i.e. includes a `walletRisk` table matching `WalletRisk`)
- `next` (peer) — `NextRequest` / `NextResponse` used in the server handler
- `zod` (peer) — request body validation in `getRisk`
- TRM Labs REST API (`https://api.trmlabs.com/public/v2/screening/addresses`) — requires a
  Base64-encoded API key passed as `trmApiKey` to `getRisk`

**Consumed by**

- `apps/earn-protocol`
- `apps/earn-protocol-institutions`

**Gotchas**

- The `trmApiKey` argument to `getRisk` must be a Base64-encoded TRM Labs API key (used as an HTTP
  Basic `Authorization` header). This is a runtime secret; it is not read from `process.env` inside
  this package — the caller is responsible for injecting it.
- All chain IDs passed to TRM are internally normalised to mainnet (`chainId = 1`) because TRM
  aggregates cross-chain risk under the Ethereum mainnet address. The `chainId` parameter is still
  required by the public API.
- The DB schema (`walletRisk` table) must be created and migrated by the consuming application; this
  package only defines the `RiskRequiredDB` interface.
- No codegen steps are required; the package is built with Vite (`vite build`).
