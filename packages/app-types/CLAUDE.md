# app-types — cross-package dependencies

`@summerfi/app-types` is the central type switchboard for the Summer.fi frontend. It exports the
enums and unions that nearly every other frontend package keys its per-chain / per-token maps off
(`SupportedNetworkIds`, `SupportedSDKNetworks`, `NetworkIds`/`NetworkHexIds`/`NetworkNames`,
`IconNamesList`, `TokenSymbolsList`), plus **build-time-generated** config types pulled from remote
JSON. Because so many maps are typed against these, and because two source files are generated (not
committed), a wrong or missing value here breaks `tsc` in a dozen packages at once. This file
documents that coupling.

## What it exports and who consumes it

| Export (file)                                                                                  | Provides                                                                                | Consumed by                                                                                              |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `SupportedNetworkIds`, `SupportedSDKNetworks` (`types/src/earn-protocol/index.ts:438,446`)     | The frontend chain switchboard; most per-chain maps are typed `[key in Supported*]`      | `app-utils`, `app-earn-ui`, `app-server-handlers`, `ssr-public-client`, `earn-protocol`, `institutions`  |
| `NetworkIds`, `NetworkHexIds`, `NetworkNames` (`types/src/networks/index.ts`)                   | Numeric / hex / string network identifiers                                              | same set of frontend packages/apps                                                                       |
| `IconNamesList`, `TokenSymbolsList`, `TokenConfig` (`types/src/icons/index.ts`)                 | String-literal unions typing every icon/token reference                                 | `app-token-config`, `app-earn-ui`, `app-icons` (indirectly), the apps                                    |
| `AppConfigType` (`types/src/generated/main-config.ts`) — **generated**                          | Shape of the main-app remote config (`CONFIG_URL`)                                       | `earn-protocol-landing-page`, apps                                                                       |
| `EarnAppConfigType` / `EarnAppFleetCustomConfigType` (`types/src/generated/earn-app-config.ts`) — **generated** | Shape of the Earn remote config (`CONFIG_URL_EARN`); the `fleetMap` type      | `app-server-handlers`, `app-utils` (`decorateWithFleetConfig`), `app-earn-ui`, `earn-protocol`, `institutions` |
| `AppRaysConfigType` (`types/src/generated/rays-config.ts`) — **generated**                      | Shape of the Rays remote config                                                          | apps                                                                                                     |
| earn-protocol domain types, mixpanel events, ToS, automation kinds, migrations                 | see `types/index.ts`                                                                     | broad; see "Consumed by" in README                                                                       |

## Generated config types (build-time coupling)

`types/src/generated/` is **gitignored** (root `.gitignore` `/packages/**/src/generated/`) — the
files are produced at build time, not committed:

- `scripts/get-config-types.js` fetches `process.env.CONFIG_URL` → writes `main-config.ts`
  (`AppConfigType`) and `rays-config.ts`.
- `scripts/get-earn-config-types.js` fetches `process.env.CONFIG_URL_EARN` → writes
  `earn-app-config.ts` (`EarnAppConfigType`).
- Both run via `pnpm get-config-types` (invoked by `dev` and `prebuild:nocache`), which loads
  `../../.env` + `../../.env.local` through `dotenv`.

Consequences:

- **If `CONFIG_URL` / `CONFIG_URL_EARN` are unset or the fetch fails, generation is skipped and the
  generated files are missing** — then `tsc` fails in every consumer that imports `AppConfigType` /
  `EarnAppConfigType` (`app-utils`, `app-server-handlers`, `app-earn-ui`, `ssr-public-client`, all
  three apps). This is the most common "why won't the frontend build" incident. Run `pnpm dev` (or
  `pnpm --filter @summerfi/app-types get-config-types`) with a populated `.env` first.
- Both env keys must be present in `turbo.json` `globalEnv` (currently lines 24–25) — they already
  are — and `turbo.json` lists `src/generated` as a build input so caches invalidate correctly.
- `earn-app-config.ts` imports `RiskType` from the committed `../earn-protocol/risk` — the generated
  file will not compile if `risk.ts` drifts from the shape the remote config expects.
- The generated `fleetMap` shape is what `packages/app-utils/src/decorators/decorateWithFleetConfig.ts`
  destructures (`systemConfig.fleetMap[chainId][vaultAddressLowercase]`). A remote-config JSON schema
  change silently reshapes these types on the next regen — rerun `get-config-types` after config
  changes and re-typecheck consumers.

## Environment variables

- `CONFIG_URL` (required for build) — main-app remote config JSON; consumed only by
  `scripts/get-config-types.js`. Read from `../../.env` / `../../.env.local`.
- `CONFIG_URL_EARN` (required for build) — Earn remote config JSON; consumed by
  `scripts/get-earn-config-types.js`.

Neither is read at runtime by this package — they are build-time-only inputs to codegen.

## Adding a new chain — this package's part

`SupportedNetworkIds` and `SupportedSDKNetworks` are the single frontend switchboard, but sibling
enums are **hand-duplicated elsewhere and do not update automatically**:

1. `types/src/earn-protocol/index.ts` — add to both `SupportedNetworkIds` (numeric `NetworkIds.*`)
   and `SupportedSDKNetworks` (SDK `Network.*` from `@summerfi/subgraph-manager-common`). Keep them
   in lockstep — most downstream maps are `[key in SupportedSDKNetworks]` / `[key in SupportedNetworkIds]`
   and fail `tsc` until every map is extended.
2. `types/src/networks/index.ts` — add matching `NetworkNames`, `NetworkIds`, `NetworkHexIds`
   entries.
3. **Duplicated copies outside this package** — `apps/earn-protocol/constants/networks-list.ts` and
   `apps/earn-protocol-institutions/constants/networks-list.ts` keep their **own** `NetworkNames` /
   `NetworkIds` enums that must match these values by hand.

The full cross-package frontend chain checklist lives in the repo-root `AGENTS.md`
("Add a new chain — frontend apps").

## Adding a new token / icon — this package's part

`IconNamesList` and `TokenSymbolsList` (`types/src/icons/index.ts`) are the type gate; they must
match runtime artifacts that share no import with this package:

- `packages/app-icons/src/index.ts` — the actual SVG registry (`IconNamesList` names must exist there
  as lazy imports).
- `packages/app-token-config/index.ts` — `tokenConfigs` entries reference `TokenSymbolsList` /
  `IconNamesList`.

See `AGENTS.md` "Add a new token — frontend apps".

## Notes

- **Actual imports** are only `@summerfi/sdk-common`, `@summerfi/serverless-shared` (peerDep),
  `@summerfi/subgraph-manager-common` and `@summerfi/summer-earn-rates-subgraph`. The `package.json`
  deps `@summerfi/armada-protocol-service`, `@summerfi/armada-protocol-common`,
  `@summerfi/sdk-client-react` and `@summerfi/summer-protocol-db` are **stale** — nothing under
  `types/` imports them. `SdkClient` is deliberately aliased to `any` in
  `types/src/sdk-client-react/index.ts` (barrel-export/`tsc` issues) rather than re-exported from
  `@summerfi/sdk-client-react`.
- `packages/app-icons` declares `@summerfi/app-types` in its `package.json` but does not import it
  (stale) — the coupling runs the other way (this package's `IconNamesList` must track app-icons'
  registry).
