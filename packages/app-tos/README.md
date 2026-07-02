# @summerfi/app-tos

Shared library that implements the full Terms of Service (ToS) acceptance flow for Summer.fi apps.
It provides both a React client hook and Next.js App Router server handlers that together drive a
challenge/JWT sign-in sequence, persist wallet-level ToS acceptance to a Kysely-backed database, and
gate access via HTTP-only cookies.

## Key exports (`src/index.ts`)

| Export                                            | Side   | Description                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useTermsOfService`                               | client | React hook that orchestrates the full ToS acceptance state machine. Expects `Omit<TOSInput, 'isGnosisSafe'>` (wallet address, viem `PublicClient`, `signMessage` callback, version string, `cookiePrefix`, chain ID, iframe flag; `isGnosisSafe` is derived internally from `isIframe`). Throws if `version` does not match `{name}_version-DD.MM.YYYY`. |
| `makeChallenge`                                   | server | Next.js route handler — generates and signs a JWT challenge (HS512, 5 min expiry; 1 day for Gnosis Safe). Requires `jwtChallengeSecret`.                                                                                                                                                                                                                 |
| `makeSignIn`                                      | server | Next.js route handler — verifies the signed challenge and issues an access-token cookie.                                                                                                                                                                                                                                                                 |
| `checkAuth`                                       | server | Next.js route handler — validates the per-wallet HTTP-only cookie using `jwtSecret`.                                                                                                                                                                                                                                                                     |
| `getTos`                                          | server | Next.js route handler — queries `tosApproval` table via Kysely, returns `{ acceptance, authorized }`.                                                                                                                                                                                                                                                    |
| `signTos`                                         | server | Next.js route handler — upserts a ToS acceptance record in `tosApproval` (updates existing record if one exists for the same address, docVersion, and chainId; otherwise inserts).                                                                                                                                                                       |
| `TOSSignMessage`, `TOSInput`, `TOSRequestContext` | types  | Core input/context types for integrating the hook and server handlers.                                                                                                                                                                                                                                                                                   |

## Commands

```bash
pnpm build      # vite build (one-shot)
pnpm dev        # vite build --watch in dev mode
pnpm lint       # eslint *.ts*
pnpm clean      # rm -rf dist
pnpm knip       # dead-code analysis
```

## Cross-package connections

**Consumes:**

- `@summerfi/app-types` — `TOSState`, `TOSStatus`, `JWTChallenge` (dev dependency)
- `@summerfi/app-utils` — `getRandomString` (dev dependency)
- `@summerfi/serverless-shared` — `getRpcGatewayEndpoint`, `chainIdSchema`, `IRpcConfig` used in
  `makeSignIn` (peer dependency)
- `jose` — JWT signing/verification (peer dependency; must satisfy `^6.0.10`)
- `kysely` — database query builder for `tosApproval` table (peer dependency; `^0.27.3`)
- `viem` — `PublicClient`, `Address` types (peer dependency)
- `next`, `react`, `zod`, `@safe-global/safe-apps-sdk` — peer dependencies that consuming apps must
  provide

**Consumed by:**

- `apps/earn-protocol`
- `apps/earn-protocol-institutions`

**Gotchas:**

- The `version` string passed to `useTermsOfService` must match the regex
  `{name}_version-DD.MM.YYYY`; the hook throws synchronously on mismatch.
- Server handlers `getTos` and `signTos` require a pre-configured `Kysely<DB>` instance where `DB`
  extends `TOSRequiredDB` (i.e. contains a `tosApproval` table). Each call destroys the database
  connection after use — pass a fresh instance per request. `checkAuth` does not use a database; it
  only requires `jwtSecret`.
- JWT secrets (`jwtChallengeSecret`, `jwtSecret`) must be supplied by the consuming app at runtime;
  this package does not read any environment variables directly.
- The `signMessage` callback passed to `useTermsOfService` must be referentially stable (memoized) —
  it is listed as a `useEffect` dependency.
