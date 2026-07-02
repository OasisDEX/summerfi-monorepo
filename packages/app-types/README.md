# @summerfi/app-types

Shared TypeScript types and enums for the Summer.fi frontend apps.

Covers: network identifiers (`NetworkIds`, `NetworkHexIds`, `NetworkNames`), the frontend-facing
chain switchboard (`SupportedNetworkIds`, `SupportedSDKNetworks`), icon and token symbol unions
(`IconNamesList`, `TokenSymbolsList`), Earn Protocol domain types (vaults, positions, fleets,
charts), UI state enums, auth, ToS, Mixpanel events, and automation kinds.

Two types are generated at build time and are not committed: `AppConfigType` (from `CONFIG_URL`) and
`EarnAppConfigType` (from `CONFIG_URL_EARN`). Run `pnpm dev` (requires `.env`/`.env.local` with both
env vars set) to regenerate `types/src/generated/` before building dependents.

**Adding a new chain:** update `SupportedNetworkIds` and `SupportedSDKNetworks` in
`types/src/earn-protocol/index.ts`, and add entries to `NetworkIds`, `NetworkHexIds`, and
`NetworkNames` in `types/src/networks/index.ts`. Both enum files must stay in sync — most per-chain
maps across the apps are typed `[key in SupportedSDKNetworks]` or `[key in SupportedNetworkIds]` and
will fail `tsc` until updated.

**Adding a new token or icon:** append to `IconNamesList` and/or `TokenSymbolsList` in
`types/src/icons/index.ts`.

## Cross-package connections

**Consumes:** `@summerfi/sdk-common`, `@summerfi/serverless-shared` (peerDep),
`@summerfi/subgraph-manager-common`, `@summerfi/summer-earn-rates-subgraph`. The `package.json` deps
`@summerfi/armada-protocol-service`, `@summerfi/armada-protocol-common`,
`@summerfi/sdk-client-react` and `@summerfi/summer-protocol-db` are stale (never imported;
`SdkClient` is aliased to `any` in `types/src/sdk-client-react/index.ts`).

**Consumed by:** the whole frontend — `earn-protocol` (~280 imports), `app-earn-ui`,
`earn-protocol-institutions`, `app-utils`, `app-tos`, `earn-protocol-landing-page`,
`app-server-handlers`, `ssr-public-client`, `app-token-config`, plus `get-vault-rates-function`
(lambda) and `update-tally-delegates` (background job). `app-icons` declares the dep but does not
import it (stale).

**Gotchas:**

- This is a central switchboard: `SupportedNetworkIds`/`SupportedSDKNetworks`
  (`types/src/earn-protocol/index.ts`), `NetworkIds`/`NetworkHexIds`/`NetworkNames`
  (`types/src/networks/index.ts`) and `IconNamesList`/`TokenSymbolsList` (`types/src/icons/index.ts`)
  type most per-chain/per-token maps across the apps, so a wrong value breaks `tsc` in many packages.
- `types/src/generated/` is gitignored and produced at build time from `CONFIG_URL` /
  `CONFIG_URL_EARN` (`scripts/get-config-types.js`, `scripts/get-earn-config-types.js`). If those env
  vars are unset the generated types (`AppConfigType`, `EarnAppConfigType`) are missing and every
  consumer that imports them fails to compile — run `pnpm dev` / `pnpm get-config-types` with a
  populated `.env` first.
- See `CLAUDE.md` for the full cross-package / build-coupling details (generated-config pipeline,
  duplicated network enums in the apps, icon/token registry coupling).
