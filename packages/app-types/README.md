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
