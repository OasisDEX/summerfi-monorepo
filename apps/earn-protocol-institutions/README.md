# @summerfi/earn-protocol-institutions

Next.js 16 application (port 3004) that provides the institutional portal for the Summer.fi Earn
protocol — giving whitelisted institutions a dedicated dashboard for viewing and managing their
Armada vaults, user whitelist/roles, activity logs, NAV/APY performance charts, and a root-admin
panel (gated to global admins) for institution and Cognito user lifecycle management.

Vaults come in two flavours with different tab sets
(`components/layout/VaultsPanelNavigationWrapper/`): standard Armada vaults (Overview / Vault
exposure / Risk Parameters / Fee & revenue admin / Asset reallocation / Asset management / Role
admin / User admin / Activity) and RWA rounds-based vaults (`selectedVault.isRwaVault`), which swap
in **Rounds** and **Roles** tabs backed by the `PanelRwa*` components under
`features/panels/vaults/components/` (activity, fee-revenue, monitoring, risk parameters, roles —
whitelist controls included — and round lifecycle). Legacy `transfers` / `whitelist` routes redirect
to `risk-parameters` / `roles`. Write flows go through a global, localStorage-persisted transaction
queue (`contexts/TransactionQueueContext/`, partitioned per institution + user) that can be exported
as a Safe Transaction Builder batch (`components/organisms/ExportToSafe/`).

## Key entry points

- `app/server-handlers/sdk/index.ts` — `getInstitutionsSDK(institutionName)` builds a
  per-institution `SDKAdminManager` (via `makeAdminSDK` from `@summerfi/sdk-client`), keyed by
  institution name and proxied through `EARN_APP_URL`; `getInstitutionsRwaSDK(clientId)` builds the
  RWA client via `makeInstiSdk({ ..., instiVersion: 'v2' })`, keyed by the vault's
  `vaultInstitutionId` fleet-config field (not the institution name).
- `app/server-handlers/institution/institution-vaults/index.ts` — all cached vault-data fetchers
  (`getCachedInstitutionVaults`, `getCachedInstitutionVault`,
  `getCachedInstitutionVaultPerformanceData`, etc.). `supportedInstitutionNetworks` covers **all**
  `SupportedNetworkIds`; chains with no institutional deployment degrade to an empty list
  (`isExpectedMissingDeploymentError`). RWA vault chains are governed by a separate list —
  `rwaSupportedNetworkIds` in `helpers/rwa.ts` (currently Mainnet + Base).
- `app/server-handlers/admin/institution/index.ts` — server actions for creating, updating, and
  deleting institutions (writes `institutions` / `feedbackMessages`); `institutionUsers` and
  `globalAdmins` mutations live in `app/server-handlers/admin/user/index.ts`.
- `app/server-handlers/institution/utils/validate-user-session.ts` —
  `validateInstitutionUserSession` / `validateInstitutionAdminSession` per-institution guards
  (RoleAdmin/SuperAdmin gate; global admins bypass; unauthorized → logout + redirect); the
  root-admin panel itself requires `session.user.isGlobalAdmin`
  (`app/server-handlers/admin/validate-admin-session.ts`).
- `contexts/TransactionQueueContext/` — global transaction queue (context + localStorage persistence
  partitioned by institution + user), wired app-wide via `GlobalProvider`; replaced the old
  `useSDKTransactionQueue` hook. Queued txs can be exported per-chain as Safe Transaction Builder
  batch JSON (`components/organisms/ExportToSafe/toSafeBatch.ts`).
- `helpers/rwa.ts`, `helpers/rwa-nav.ts`, `helpers/rwa-roles.ts` — RWA chain list, NAV math, and
  role descriptors; `helpers/get-institution-vault-cache-tags.ts` produces the per-vault + list
  cache tags used by the post-write revalidation flow (`hooks/useRevalidateTags.ts` →
  `app/api/revalidate/route.ts`).
- `constants/vaults-starting-nav-values.ts` — `VAULTS_STARTING_NAV_VALUES`: hand-maintained map of
  `'<vaultAddress>-<chainId>'` to baseline NAV used by performance charts.
- `constants/networks-list.ts` — local `NetworkNames`/`NetworkIds` enums and
  `SDKChainIdToRpcGatewayMap` pointing client RPC calls at `/api/rpcGateway`.
- `constants/vaults.ts` — `vaultSpecificRolesList` listing the three queried on-chain roles:
  `COMMANDER_ROLE`, `CURATOR_ROLE`, `KEEPER_ROLE`.
- `helpers/get-insti-subgraph-id.ts` — derives the bytes32 subgraph ID from an institution name
  (`bytesToHex(stringToBytes(name, { size: 32 }))`); must match the name used at on-chain/subgraph
  registration.

## Scripts

| Command           | What it does                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `pnpm dev`        | `next dev` on port 3004 + CSS module type watcher (requires `.env` / `.env.local` at repo root) |
| `pnpm build:apps` | Production Next.js build (webpack mode)                                                         |
| `pnpm start`      | Serve the production build on port 3004                                                         |
| `pnpm codegen`    | Regenerate GraphQL clients from `codegen.yml` (requires `SUBGRAPH_BASE` env var)                |
| `pnpm lint`       | `tsc --noEmit` + ESLint                                                                         |

`prebuild` runs `codegen` and CSS-module type generation automatically before every build.

## Cross-package connections

**Consumes:**

- `@summerfi/summer-protocol-institutions-db` — Postgres DB (`institutions`, `institutionUsers`,
  `globalAdmins`, `feedbackMessages` tables); connection via
  `EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING`.
- `@summerfi/sdk-client` — `makeAdminSDK` / `SDKAdminManager` for standard vaults and `makeInstiSdk`
  (with `Insti-Version: v2` header) for RWA vaults; proxy URL set to `EARN_APP_URL`.
- `@summerfi/app-earn-ui`, `@summerfi/app-types`, `@summerfi/app-utils`,
  `@summerfi/app-server-handlers`, `@summerfi/sdk-common`, `@summerfi/sdk-client-react` — shared UI
  components, types, utilities, and SDK React hooks from the monorepo.
- `@summerfi/armada-protocol-abis` — `FleetCommanderAbi` for on-chain reads in
  `institution-vaults/index.ts`.
- `@safe-global/safe-apps-sdk` / `@safe-global/safe-apps-provider` — Safe App detection and the
  Export-to-Safe transaction-batch flow.
- AWS Cognito — institution user pool managed via `INSTITUTIONS_COGNITO_ADMIN_ACCESS_KEY`,
  `INSTITUTIONS_COGNITO_ADMIN_SECRET_ACCESS_KEY`, `INSTITUTIONS_COGNITO_USER_POOL_ID`.
- GraphQL subgraph `summer-institutions-base` at `${SUBGRAPH_BASE}/summer-institutions-base` (vault
  history, institution data); client code in `graphql/clients/` is generated by `pnpm codegen` and
  must be re-run when queries or schema change.
- Remote earn config fetched via `configEarnAppFetcher` from `@summerfi/app-server-handlers`
  (`CONFIG_URL_EARN` env var, cached 5 min).

**No other monorepo package imports from this app** (it is a leaf application).

**Critical gotchas:**

- `VAULTS_STARTING_NAV_VALUES` in `constants/vaults-starting-nav-values.ts` is explicitly
  hand-maintained — add an entry for every new institutional vault or NAV charts will have no
  baseline.
- Standard-vault chain coverage derives automatically from `SupportedNetworkIds`, but
  `SDKChainIdToRpcGatewayMap` in `constants/networks-list.ts` is still hand-maintained — a new chain
  needs an entry there, and an RWA chain additionally needs adding to `rwaSupportedNetworkIds` in
  `helpers/rwa.ts`.
- Institution subgraph ID is derived deterministically from the institution name string; the
  on-chain/subgraph registration must use the identical string.
- GraphQL clients under `graphql/clients/` are generated artifacts — run `pnpm codegen` after any
  schema or query change before building.
