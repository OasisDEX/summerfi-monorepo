# Cross-Package Change Checklists

This file maps out how the workspaces in this monorepo connect, and gives ordered checklists for
common changes that span multiple packages. File paths are relative to the repo root.

## Package Map

- **SDK layering (`sdk/`)** — domains are split into `<domain>-common` (interfaces/types only, e.g.
  `tokens-common` exports `ITokensManager`/`ITokensProvider`) and `<domain>-service` (a factory +
  concrete implementation, e.g. `TokensManagerFactory.newTokensManager`). Consumers depend on the
  `-common` contracts; `sdk/sdk-server` composes all the service factories into a per-request tRPC
  context (`sdk/sdk-server/src/context/SDKContext.ts`) and exposes them via the `sdkAppRouter` route
  tree (`sdk/sdk-server/src/SDKAppRouter.ts`). `sdk/sdk-client` (and `sdk-client-react`) wrap those
  tRPC procedures in client manager classes hung off `SDKManager` (`makeSDK`), giving apps
  end-to-end types from the exported `SDKAppRouter` type.
- **Frontend apps (`apps/`)** — `earn-protocol`, `earn-protocol-institutions` and
  `earn-protocol-landing-page` consume the SDK client plus the shared `packages/app-*` libraries
  (`app-types` holds the `SupportedNetworkIds`/`SupportedSDKNetworks` switchboard enums,
  `app-earn-ui` the component library and chain/icon maps, `app-server-handlers` the server-side
  data fetchers, `app-utils` helpers). Per-fleet presentation comes from a remote JSON config
  (`CONFIG_URL_EARN`), not from code.
- **Lambdas + stacks** — `summerfi-api/*`, `external-api/*` and `background-jobs/*` are Lambda
  handler packages built on `packages/serverless-shared` (canonical `ChainId`/`Network` registry,
  response helpers). They are deployed by SST: `sst.config.ts` wires `stacks/summer-stack.ts` (main
  API) and `stacks/partners-stack.ts` (partner gateway); each feature has an `add<Feature>Config`
  module in `stacks/`. The SDK has its own SST app under `sdk/`.
- **Subgraph clients** — the subgraphs themselves are deployed from other repos; this repo only
  holds typed client packages. Legacy clients (`aave-spark-`, `ajna-`, `automation-`,
  `morpho-blue-`, `prices-`, `summer-events-subgraph`) codegen from a checked-in `schema.graphql`;
  the `summer-earn-*-subgraph` clients codegen by introspecting the live endpoint. All resolve
  endpoints at runtime as `${SUBGRAPH_BASE}/<subgraph-name>` via per-chain name maps. SDK-side,
  `subgraph-manager-service` reads `SDK_SUBGRAPH_CONFIG`.
- **Env vars** — the SDK's `ConfigurationProvider` only loads keys listed in `turbo.json`
  `globalEnv` (and the SST stack config in `sdk/sst-environment.ts`); lambdas read `process.env`
  injected by the `stacks/` modules from `../.env`.
- **Databases** — `packages/summer-protocol-db`, `summer-institutions-db` and `summer-beach-club-db`
  are Kysely clients with migrations; consumers pass connection strings from env (e.g.
  `EARN_PROTOCOL_DB_CONNECTION_STRING`).
- **Contracts** — `armada-protocol/abis` (+ `contracts` submodule) for Armada v2;
  `packages/core-contracts` + `deployment-configs` for the legacy operations system.

## Checklists

### Add a new SDK service

1. **Repo root** — follow `sdk/docs/ADD_SDK_SERVICE.md`: run `turbo gen` and select "service: Adds a
   new service to the SDK", entering a PascalCase name (e.g. `MoneyProvider`). The generator
   (`turbo/generators/sdk-service`, wired in `turbo/generators/config.ts` via
   `setupSDKServiceGenerator`) scaffolds two packages: `sdk/<name>-common` (interfaces/types only)
   and `sdk/<name>-service` (factory + implementation), following the repo-wide `-common` vs
   `-service` layering described in the Package Map.
2. **`@summerfi/sdk-server`** — `sdk/sdk-server/src/context/SDKContext.ts`: add the `I<Name>Manager`
   (from `<name>-common`) to the `SDKAppContext` type and instantiate it via the service factory
   inside `createSDKContext`, passing the shared `ConfigurationProvider` /
   `BlockchainClientProvider` / other managers as needed. This is how every existing service
   (abi-provider, tokens, swap, oracle, allowance, armada, rwa, etc.) is composed.
3. **`@summerfi/sdk-server`** — `sdk/sdk-server/src/SDKAppRouter.ts`: add handler files under
   `src/handlers/` (or a domain folder like `armada-protocol-handlers/`) that are `publicProcedure`
   (from `SDKTRPC.ts`) calls reading the manager off `ctx`, then mount them in the `sdkAppRouter`
   route tree (e.g. under a new namespace alongside tokens/swaps/oracle/armada/rwa). The exported
   `SDKAppRouter` type is what gives sdk-client end-to-end types.
4. **`@summerfi/sdk-client`** — `sdk/sdk-client/src/implementation/SDKManager.ts`: expose the new
   procedures to consumers by adding a client wrapper class in `src/implementation/` implementing an
   interface in `src/interfaces/` (pattern: `TokensManagerClient` / `ITokensManagerClient`,
   `OracleManagerClient`, etc. — all extend `IRPCClient` and call
   `this.rpcClient.<namespace>.<proc>.query/mutate`), and hang it off `SDKManager` (created by
   `makeSDK` in `MakeSDK.ts`).
5. **Env config** — if the service needs new environment variables, add the keys to `turbo.json`
   `globalEnv` (and the SST stack config in `sdk/sst-environment.ts`) — `ConfigurationProvider` only
   loads keys listed in `turbo.json` `globalEnv` and throws
   `Missing env variable: <name>. Please add it to the stack configuration in sst-environment and turbo.json.`
   otherwise.

### Add a new protocol plugin

1. **Repo root** — follow `sdk/docs/ADD_NEW_PLUGIN.md`: run `turbo gen` and select "plugin: Add a
   new protocol plugin" (generator: `turbo/generators/protocol-plugins`, wired in
   `turbo/generators/config.ts` via `setupProtocolPluginGenerator`). It scaffolds
   `sdk/protocol-plugins/src/plugins/<plugin-name>/` — existing plugins (aave-v3, maker, morphoblue,
   spark) each have `abis/`, `actions/`, `builders/`, `implementation/`, `interfaces/` subfolders.
2. **`@summerfi/protocol-plugins`** — in `sdk/protocol-plugins/src/plugins/<plugin-name>/`, per
   ADD_NEW_PLUGIN.md: define Debt & Collateral lending pool configs and the protocol-specific ABI
   map in the plugin's `Types.ts`; in `<PluginName>ProtocolPlugin.ts` implement `getPool`, update
   the plugin schema, create a `<PluginName>PoolId`, and add the required ABIs; implement action
   builders/actions (the template includes a MakerPaybackWithdraw example). Plugins extend
   `BaseProtocolPlugin` (`src/implementation/BaseProtocolPlugin.ts`) and receive an
   `IProtocolPluginContext` (provider, tokensManager, oracleManager, swapManager,
   addressBookManager) defined in `protocol-plugins-common`.
3. **`@summerfi/sdk-common`** — `sdk/sdk-common/src/common/enums/ProtocolName.ts`: add the new
   protocol to the `ProtocolName` enum (the enum lives in sdk-common, not in protocol-plugins).
4. **`@summerfi/protocol-plugins`** — `sdk/protocol-plugins/src/plugins/ProtocolPluginsRecord.ts`:
   register the plugin class keyed by `ProtocolName` ("Note: add here the plugins you want to use in
   the SDK"). sdk-server picks this record up in `src/context/CreateProtocolPluginsRegistry.ts`,
   which builds a `ProtocolPluginsRegistry` whose context provider is the Ethereum Mainnet
   blockchain client; `ProtocolManager` (`protocol-manager-service`) then dispatches `getPosition` /
   `getLendingPool` / `getImportPositionTransaction` through the registry.

### Add a new chain — SDK

1. **`@summerfi/sdk-common`** — `sdk/sdk-common/src/common/implementation/ChainIds.ts`: add the
   network to the `ChainIds` const (currently Mainnet 1, Base 8453, ArbitrumOne 42161, Sonic 146,
   Hyperliquid 999). The `ChainId` union type and its zod `ChainIdSchema` / `isChainId` guard in
   `src/common/types/ChainId.ts` are derived automatically from this object, so it is the single
   source of truth for "supported chain".
2. **`@summerfi/sdk-common`** — `sdk/sdk-common/src/common/implementation/ChainFamilies.ts`: add a
   `ChainFamilyName` enum entry, a `<Name>Family` record with
   `ChainInfo.createFrom({chainId, name})`, and register it in `ChainFamilyMap`.
   `getChainInfoByChainId` / `getChainFamilyInfoByChainId` (used by sdk-server's `createSDKContext`
   to resolve `SUMMER_DEPLOYED_CHAINS_ID` into `supportedChains`) throw "Chain with id X not
   supported" for unmapped ids.
3. **`@summerfi/sdk-common`** — `sdk/sdk-common/src/common/utils/chainIdToGraphChain.ts`: extend the
   `GraphChain` slug union and `keyMap` (mainnet/base/arbitrum/sonic/hyperliquid). This slug is used
   both for subgraph endpoint selection and as the `network` query param of the RPC gateway URL
   (`getRpcGatewayEndpoint` in blockchain-client-provider).
4. **`@summerfi/sdk-common`** — `sdk/sdk-common/src/common/utils/getViemChain.ts`: add the viem
   chain to the `extractChain` list; if the chain is not bundled in `viem/chains`, define it with
   `defineChain` like the exported `hyperliquid` (HyperEVM, id 999, includes multicall3 address).
5. **`@summerfi/blockchain-client-provider`** —
   `sdk/blockchain-client-provider/src/implementation/BlockchainClientProvider.ts`: add the viem
   chain to the constructor's `_loadClients([mainnet, arbitrum, base, sonic, hyperliquid])` preload
   list — chains not preloaded throw "Chain not supported" even if present in `ChainIds`. Clients
   route through the RPC gateway from the `SDK_RPC_GATEWAY` env var.
6. **Env config** — `turbo.json`: add the chain id to the comma-separated
   `SUMMER_DEPLOYED_CHAINS_ID` env var (and `SUMMER_DEPLOYED_CHAINS_ID_INSTI` / `_RWA` / `_DCA`
   where applicable) consumed by `sdk/sdk-server/src/context/SDKContext.ts`, and update
   `SDK_SUBGRAPH_CONFIG` (read by `ArmadaSubgraphManager` / `DcaSubgraphManager` in
   `subgraph-manager-service`). Env keys must exist in `turbo.json` `globalEnv` and the SST stack
   config (`sdk/sst-environment.ts`).
7. **`@summerfi/armada-protocol-service` / `@summerfi/address-book-service`** —
   `sdk/armada-protocol-service/src/deployment-provider/`: contract addresses come from deployments,
   not from sdk-common: `fetchPublicDeploymentProviderConfig` (armada-protocol-service) must cover
   the new chain id for public requests, and `AddressBookManagerFactory` resolves addresses from
   `@summerfi/core-contracts` `Deployments` keyed `` `${chainInfo.name}.standard` `` — so the
   protocol must actually be deployed and indexed there. e2e additionally expects an
   `E2E_SDK_FORK_URL_<CHAIN>` env var (pattern in `turbo.json` `globalEnv`).
8. **`@summerfi/tokens-service`** —
   `sdk/tokens-service/src/implementation/static/StaticTokensList.ts`: add token entries for the new
   chainId to `StaticTokensData` so `TokensManager` can resolve tokens by symbol/name/address on
   that chain.

### Add a new chain — frontend apps

1. **`@summerfi/app-types`** — `packages/app-types/types/src/earn-protocol/index.ts`: add the chain
   to the hand-maintained `SupportedNetworkIds` enum (maps `NetworkIds.*` numeric chain ids) and
   `SupportedSDKNetworks` enum (maps `Network.*` values from `@summerfi/subgraph-manager-common`).
   These two enums are the single switchboard the whole frontend keys off — most other per-chain
   maps are typed `[key in SupportedSDKNetworks]` or `[key in SupportedNetworkIds]` and fail tsc
   until updated.
2. **`@summerfi/app-types`** — `packages/app-types/types/src/networks/index.ts`: add entries to
   `NetworkNames`, `NetworkIds` and `NetworkHexIds` enums (e.g. `SONICMAINNET = 146`,
   `HYPERLIQUID = 999` / `'0x3e7'`).
3. **`@summerfi/app-utils`** — `packages/app-utils/src/helpers/earn-network-tools.ts`: update the
   hand-written network mapping helpers: `humanReadableNetworkMap`, `humanReadableChainToLabelMap`,
   the `isSupportedSDKChain` narrowing union, and the viem chain imports (arbitrum, base,
   hyperliquid, mainnet, sonic from `viem/chains`). Also update `get-arks-rates-url.ts`, which has
   per-network maps to `${apiUrl}/api/rates/<chainId>` and
   `${apiUrl}/api/historicalRates/<chainId>`.
4. **`@summerfi/app-earn-ui`** — `packages/app-earn-ui/src/constants/supported-chains.ts`: add the
   viem chain object to `supportedViemChains` (this array is consumed directly by
   `apps/earn-protocol/providers/WalletProvider/wagmi.ts` to build the Privy/wagmi config and
   per-chain http transports at `/earn/api/rpc/chain/<id>`). Also add the network icon mappings in
   `src/constants/icon-maps.tsx` and `src/helpers/network-icons.ts` (both keyed exhaustively on
   `SupportedNetworkIds` / `SupportedSDKNetworks`), and optionally a `networkWarnings` entry in
   `src/constants/earn-protocol.ts`.
5. **`@summerfi/app-server-handlers`** —
   `packages/app-server-handlers/src/arks-interest-rates/constants.ts`: add a `GraphQLClient` entry
   for the new chain's rates subgraph:
   `` `${process.env.SUBGRAPH_BASE}/summer-earn-protocol-rates-<chain>` `` (the map is typed
   `[key in SupportedSDKNetworks]`, so it is a compile error until added). `vaults-info/index.ts`
   and vaults-apy need no edits — they iterate `Object.values(SupportedNetworkIds)` automatically.
6. **`@summerfi/ssr-public-client`** — `packages/ssr-public-client/src/get-ssr-public-client.ts`:
   add the viem chain to `SSRChainConfigs` and an RPC gateway entry in `src/rpc-gateway-ssr.ts`
   (`SDKChainIdToSSRRpcGatewayMap`, typed `[key in SupportedNetworkIds]`, built from the
   `RPC_GATEWAY` env var via `getRpcGatewayUrl`).
7. **`@summerfi/earn-protocol`** — the app keeps its own copies: add `NetworkNames` / `NetworkIds`
   entries and a client-side RPC gateway entry in `apps/earn-protocol/constants/networks-list.ts`
   (window-origin `/earn/api/rpcGateway?network=...`), an SSR entry in `helpers/rpc-gateway-ssr.ts`
   (`SDKChainIdToSSRRpcGatewayMap`), an entry in `app/server-handlers/subgraphs-map.ts`
   (`subgraphsMap`: `` `${SUBGRAPH_BASE}/summer-protocol-<chain>` ``), and a redirect/network-icon
   entry in `constants/network-id-to-icon.tsx`. `next.config.ts` redirects to pro.summer.fi are
   per-network-name and may need a new entry.
8. **`@summerfi/earn-protocol-institutions`** — same duplicated constants as earn-protocol:
   `apps/earn-protocol-institutions/constants/networks-list.ts` (`NetworkNames` / `NetworkIds`
   enums + `SDKChainIdToRpcGatewayMap`, client RPC at `/api/rpcGateway`). If institutions should run
   on the chain, also extend the hard-coded `supportedInstitutionNetworks` array
   (`[Base, ArbitrumOne]`) in `app/server-handlers/institution/institution-vaults/index.ts`.
9. **External/infra** — outside the apps: deploy the per-chain subgraphs named
   `summer-protocol-<chain>` and `summer-earn-protocol-rates-<chain>` under `SUBGRAPH_BASE`, enable
   the chain in the SDK backend (`SDK_API_URL`), add the network to the RPC gateway (`RPC_GATEWAY`),
   and add the chain's `fleetMap` section to the remote config served at `CONFIG_URL_EARN`.
   graphql-codegen (`codegen.yml`) only pins one network's schema for type generation, so it usually
   needs no change.

### Add a new chain — APIs (lambdas)

1. **`@summerfi/serverless-shared`** — `packages/serverless-shared/src/domain-types.ts`: add the
   chain to the `ChainId`, `Network` and `NetworkNames` enums and to the `NetworkByChainID` /
   `ChainIDByNetwork` records. This is the canonical chain registry for all lambdas;
   `getRpcGatewayEndpoint` builds the RPC URL as `${RPC_GATEWAY}/?network=<Network>...`, so the RPC
   gateway service must also know the network name.
2. **Subgraph client packages** —
   `packages/summer-earn-protocol-subgraph/src/utils/subgraphNameByChainMap.ts` (and
   `supportedChains.ts`), `packages/summer-earn-rates-subgraph/src/utils/subgraphNameByChainMap.ts`,
   plus prices-subgraph / automation-subgraph / aave-spark-subgraph / ajna-subgraph /
   morpho-blue-subgraph equivalents as applicable: map the new `ChainId` to its deployed subgraph
   name (URLs are `${SUBGRAPH_BASE}/<name>`). Functions like get-rates call
   `getAllClients(SUBGRAPH_BASE)`, which builds a client per supported chain, so a missing entry
   breaks at startup. A subgraph must actually be deployed for the chain.
3. **`@summerfi/summer-protocol-db`** — `packages/summer-protocol-db/src/helpers.ts` and a new
   migration in `packages/summer-protocol-db/src/migrations/`: add the network string to the
   `DbNetworks` type and the `dbNetworkToChainId` map, and add a Kysely migration extending the
   network enum in Postgres (precedent: `004_add_sonic_network.mts`). Regenerate/extend
   `database-types.ts` accordingly. Run via `pnpm db:migrate` / `migrate:latest`.
4. **setup-trigger / triggers** — only if borrow automation should work on the chain:
   `summerfi-api/setup-trigger-function/src/services/index.ts` (add the viem chain to
   `domainChainIdToViemChain`) and `packages/triggers-shared/src/get-addresses.ts` (make
   `getAddresses` return contract addresses for the network — it currently throws for SONIC and
   HYPERLIQUID; addresses come from `@oasisdex/addresses`). `supportedChainSchema` in
   `triggers-shared/src/types.ts` validates against `ChainId` values automatically.
5. **Per-function chain allowlists** — several functions keep their own `ChainId`-keyed config:
   `summerfi-api/get-migrations-function/src/migrations-config.ts` (maps `ChainId` to eligible
   protocols), `summerfi-api/spark-rewards-claim/src/supportedChainIds.ts` (hardcodes
   `[ChainId.MAINNET]`), `summerfi-api/get-apy-function/src/protocols/*` (per-chain handling),
   `background-jobs/update-beach-club-rewards-function/src/client.ts` (hardcodes subgraph URLs per
   Network). `Record<ChainId, ...>` types make TS force updates in most of these.
6. **Stacks / env** — no `stacks/` change is normally needed — chains are resolved at runtime from
   `RPC_GATEWAY` and `SUBGRAPH_BASE` — but the RPC gateway and subgraph host behind those URLs
   (configured in `../.env` for deployment) must support the new network.

### Add a new token — SDK

1. **`@summerfi/tokens-service`** —
   `sdk/tokens-service/src/implementation/static/StaticTokensList.ts`: append a `TokenData` entry
   (`{name, address, symbol, decimals, chainId, logoURI}`) to `StaticTokensData.tokens` under the
   comment block for the right chain. `StaticTokensProvider` builds a per-ChainId `TokensMap` from
   this list and serves `getTokenBySymbol/ByName/ByAddress`; unknown ERC-20s can still be resolved
   on-chain via the blockchain client (`erc20Abi`) for address lookups, but symbol/name lookups need
   the static entry.
2. **`@summerfi/sdk-common`** — `sdk/sdk-common/src/common/enums/CommonTokenSymbols.ts`: optionally
   add the symbol to the `CommonTokenSymbols` enum — purely a typo-avoidance convenience;
   `TokenSymbol` itself (`src/common/enums/TokenSymbol.ts`) is `type TokenSymbol = string`, so any
   string works with the tokens manager.
3. **`@summerfi/sdk-server`** — no server changes needed: the tokens tRPC namespace
   (`tokens.getTokenBySymbol/ByName/ByAddress` in `SDKAppRouter.ts`, handlers like
   `sdk/sdk-server/src/handlers/getTokenBySymbol.ts`) reads from `ctx.tokensManager`, which the
   `TokensManagerFactory` builds from the static list at request time.

### Add a new token — frontend apps

1. **`@summerfi/app-icons`** — `packages/app-icons/src/icons/`: add the token SVG (e.g.
   `<symbol>_circle_color.svg`) and register it in `src/index.ts` (customLazy import entry in the
   `icons` map; ~381 SVGs today).
2. **`@summerfi/app-types`** — `packages/app-types/types/src/icons/index.ts`: add the icon name to
   the hand-maintained `IconNamesList` string-literal union and the token symbol to the
   `TokenSymbolsList` union. These unions type-check every icon/token reference across apps.
3. **`@summerfi/app-token-config`** — `packages/app-token-config/index.ts`: add a `TokenConfig`
   entry to the `tokenConfigs` array:
   `{ symbol, name, iconName, optional rootToken (e.g. 'ETH'/'BTC' for derivatives) }`. This is the
   only export of the package.
4. **`@summerfi/app-earn-ui`** — `packages/app-earn-ui/src/constants/swap-tokens.ts`: if the token
   should appear in the deposit/swap dropdown, add the symbol to the per-chain hand-list in
   `swapTokens` (keyed by `SupportedNetworkIds`).
5. **`@summerfi/earn-protocol`** — check token-classification helpers such as
   `apps/earn-protocol/helpers/is-stablecoin.ts` if the token is a stablecoin (affects
   formatting/filters). Token balances and vault input tokens otherwise flow in from the
   SDK/subgraph without app changes.

### New fleet (vault) deployed

1. **Discovery (no code)** — apps discover fleets dynamically from the SDK backend, not from a
   hand-list: `apps/earn-protocol/app/server-handlers/sdk/get-vaults-list.ts` calls
   `backendSDK.armada.users.getVaultsRaw` per `SupportedNetworkIds` chain, and
   `packages/app-server-handlers/src/vaults-info/index.ts` calls
   `backendSDK.armada.users.getVaultInfoList` per chain. The SDK server in turn reads the protocol
   subgraphs. A new fleet indexed by the subgraph + known to the SDK appears automatically.
2. **Remote config (`CONFIG_URL_EARN`)** — per-fleet presentation/custom fields come from the remote
   JSON config fetched by `configEarnAppFetcher`
   (`packages/app-server-handlers/src/system-config/index.ts`) and merged in
   `packages/app-utils/src/decorators/decorateWithFleetConfig.ts` via
   `systemConfig.fleetMap[chainId][vaultAddressLowercase]` (risk label, `vaultCurator` →
   `isRwaVault` flag, `vaultInstitutionId` → RWA SDK `Client-Id`, etc.). Add the new fleet's entry
   to the config service; no repo change needed unless the config JSON shape changes — the
   `EarnAppFleetCustomConfigType` type is regenerated from the live config by
   `packages/app-types/scripts/get-earn-config-types.js` (run via `pnpm get-config-types`, writes
   `types/src/generated/earn-app-config`).
3. **Filtering gotcha** — `decorateWithFleetConfig` filters out vaults with `depositCap <= 0` and
   (if the `FilterZeroTokenVaults` feature flag is on in remote config) `inputTokenBalance <= 0`,
   unless the user already has a position — a freshly deployed empty/capped fleet may be invisible
   until seeded or capped > 0.
4. **`@summerfi/earn-protocol`** — RWA (institutions-v2) fleets are config-driven:
   `get-rwa-vaults-list.ts` iterates `rwaSupportedChainIds` (derived from `rwaSubgraphsMap` in
   `app/server-handlers/subgraphs-map.ts`; currently Mainnet + Base) and, per chain,
   `getRwaClientIdsForChain(...)` — client IDs come from each fleet's `vaultInstitutionId` config
   field. Onboarding a new institution = set `vaultInstitutionId` in the fleet config; a new RWA
   chain = a one-line `rwaSubgraphsMap` edit. Only `RWA_INSTI_VERSION` remains in
   `apps/earn-protocol/constants/rwa.ts`.
5. **`@summerfi/earn-protocol-institutions`** —
   `apps/earn-protocol-institutions/constants/vaults-starting-nav-values.ts`:
   `VAULTS_STARTING_NAV_VALUES` is an explicitly hand-maintained map of `'<vaultAddress>-<chainId>'`
   → starting NAV (the file comment says it must be kept updated manually) — add an entry for each
   new institutional vault so NAV charts have a baseline.
6. **Fleet naming convention** — `packages/app-utils/src/helpers/human-readable-fleet-names.ts`
   derives display names by parsing the on-chain fleet name as `..._<Risk>_<TOKEN>` (e.g.
   `LazyVault_LowerRisk_USDT`) — new fleets should follow this underscore convention or get a
   fallback raw name.

### Institution onboarded (earn-protocol-institutions)

1. **`@summerfi/earn-protocol-institutions`** —
   `apps/earn-protocol-institutions/app/server-handlers/admin/institution/index.ts`: the primary
   path is runtime, not code: a root admin uses the admin panel
   (`features/admin/AdminPanelInstitutions*.tsx`) whose server action
   `rootAdminActionCreateInstitution` inserts a row (name, displayName, logoUrl, logoFile) into the
   `institutions` table of `@summerfi/summer-protocol-institutions-db`
   (`EARN_PROTOCOL_INSTITUTION_DB_CONNECTION_STRING`). Institution users are created in AWS Cognito
   (`INSTITUTIONS_COGNITO_*` env vars) and linked via the `institutionUsers` table
   (`app/server-handlers/institution/institution-users`).
2. **`@summerfi/earn-protocol-institutions`** —
   `apps/earn-protocol-institutions/app/server-handlers/sdk/index.ts`: per-institution SDK access is
   dynamic: `getInstitutionsSDK(institutionName)` builds a `makeAdminSDK` client with `clientId` =
   institution name, proxied through `EARN_APP_URL`. The subgraph-side institution id is derived
   deterministically by `helpers/get-insti-subgraph-id.ts` (bytes32 hex of the institution name) —
   the on-chain/subgraph deployment must register the institution under the exact same name string.
3. **`@summerfi/earn-protocol-institutions`** —
   `apps/earn-protocol-institutions/app/server-handlers/institution/institution-vaults/index.ts`:
   institution vaults are discovered via `institutionSdk.armada.users.getVaultInfoList` over the
   hard-coded `supportedInstitutionNetworks = [Base, ArbitrumOne]`, cross-referenced with the
   summer-institutions-base subgraph (`GetInstitutionData` / vault-history GraphQL clients generated
   by `codegen.yml` against `${SUBGRAPH_BASE}/summer-institutions-base`) and decorated with the
   remote earn config (`getCachedConfig` → `CONFIG_URL_EARN`). Vault roles shown are the fixed list
   in `constants/vaults.ts` (COMMANDER/CURATOR/KEEPER).
4. **`@summerfi/earn-protocol-institutions`** —
   `apps/earn-protocol-institutions/constants/vaults-starting-nav-values.ts`: add a hand-maintained
   starting-NAV entry per institutional vault (`'<address>-<chainId>': value`) for NAV/performance
   charts.
5. **Infra** — off-repo prerequisites: institution + vaults deployed and indexed by the
   summer-institutions(-v2) subgraphs, institution registered in the SDK backend's deployment config
   under the institution clientId, Cognito user pool entries, and (if surfaced in the public earn
   app as an RWA vault) the fleet's `vaultCurator` and `vaultInstitutionId` entries in the
   `CONFIG_URL_EARN` `fleetMap` — the per-institution `Client-Id` is derived from
   `vaultInstitutionId` at runtime (no repo constant to edit).

### Add a new API function/lambda

1. **New function package** — `summerfi-api/<name>-function/package.json`: create a new workspace
   package under `summerfi-api/` (or `external-api/` for the partner gateway, `background-jobs/` for
   crons). Name it `@summerfi/<name>-function`, depend on `@summerfi/serverless-shared`
   (`ResponseOk`/`ResponseBadRequest` helpers, `ChainId` types) plus any subgraph client packages,
   and add the standard scripts (build via `tsc -b` or esbuild bundle,
   `test: jest --passWithNoTests`, lint). Existing packages use either tsc project builds or esbuild
   bundling (see get-migrations-function vs get-apy-function) — SST bundles from source paths either
   way.
2. **New function package** — `summerfi-api/<name>-function/src/index.ts`: export a
   `handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2>` (cron jobs use
   `EventBridgeEvent` instead). Validate query/path params with zod, read config from `process.env`
   (`RPC_GATEWAY`, `SUBGRAPH_BASE`, etc.).
3. **Stacks** — `stacks/<feature>.ts`: create (or extend) a stack module exporting an
   `add<Feature>Config(context)` function. Instantiate
   `new Function(stack, '<id>', { handler: 'summerfi-api/<name>-function/src/index.handler', runtime: 'nodejs20.x', environment: {...} })`.
   The handler path points at the TS source file relative to repo root. Validate required env vars
   with explicit throws (pattern used by `triggers.ts`, `apy.ts`, `portfolio.ts`). If the function
   needs the Postgres DBs or ElastiCache it must be put in the VPC (pass `vpc.vpc` +
   `privateSubnets`, as in `apy.ts` / `summer-protocol.ts`) — VPC and Redis exist only on
   staging/production (`attachVPC` and `addRedis` return null on dev stages).
4. **Stacks** — `stacks/summer-stack.ts`: register the module: call
   `add<Feature>Config(summerContext)` inside `API()`. Routes are attached with
   `api.addRoutes(stack, { 'GET /api/<path>': fn })`. For partner-facing endpoints register in
   `stacks/partners-stack.ts` (`ExternalAPI`) instead, which serves gateway.summer.fi /
   gateway.staging.summer.fi. For scheduled jobs use `new Cron(stack, ..., { schedule, job })` as in
   `stacks/summer-protocol.ts` and `stacks/summer-earn-app-tables.ts`.
5. **Root** — `sst.config.ts`: no change needed unless adding a whole new stack: it only wires
   `app.stack(API)` and `app.stack(ExternalAPI)` for the summerfi-stack app. Required env vars
   (`RPC_GATEWAY`, `SUBGRAPH_BASE`, `EARN_PROTOCOL_DB_CONNECTION_STRING`, `DEBANK_*`, `VPC_ID`,
   `SECURITY_GROUP_ID`, ...) come from `../.env` via dotenv. Deploy with `pnpm sst:deploy:staging` /
   `sst:deploy:prod` (production deploys are blocked unless on main/dev branch with clean tree and
   passing `pnpm cicheck`). Dev stages (`dev-$SST_USER`) auto-start
   `stacks/local-env/docker-compose.yaml` (local redis + postgres containers).
6. **Root** — `package.json`: the `cicheck` script runs turbo cicheck filtered to `./packages/*`,
   `./external-api/*`, `./summerfi-api/*` — new packages in those dirs are picked up automatically
   by the pnpm workspace; `background-jobs` packages are **not** in the cicheck filter.

### Add a new trigger type

1. **`@summerfi/triggers-shared`** — `packages/triggers-shared/src/types.ts`: add the trigger to the
   `SupportedTriggers` enum (kebab-case URL segment, e.g. `'dma-partial-take-profit'`) and define
   its zod event-body schema / types. The POST route is
   `/api/triggers/{chainId}/{protocol}/{trigger}`, so the enum value is the path segment. Also
   extend `packages/triggers-shared/src/contracts/get-triggers-response.ts` so the trigger appears
   in the GET `/api/triggers` contract.
2. **setup-trigger** — `summerfi-api/setup-trigger-function/src/types/`: add the per-protocol event
   body types/validators and extend `getBodySchema` so the `{protocol, trigger, chainId}` path
   combination resolves to a schema — an unresolved combination returns "Unsupported trigger".
3. **setup-trigger** — `summerfi-api/setup-trigger-function/src/services/`: implement a
   `get-<protocol>-<trigger>-service-container.ts` providing
   `{ simulatePosition, getTransaction, validate }` (see existing 15 containers, e.g.
   `get-aave-auto-buy-service-container.ts`), plus encoder in `src/services/trigger-encoders/` and
   validator in `src/services/against-position-validators/`. Then wire it in
   `src/services/index.ts`: add an `is<X>` type-guard matching the on-chain TriggerType id from
   `@oasisdex/automation` and a branch in `buildServiceContainer` returning the new container. The
   trigger type ids must exist in the `@oasisdex/automation` package's `TriggerType` enum.
4. **`@summerfi/triggers-calculations`** — `packages/triggers-calculations/src/`: add any
   position/simulation math shared between setup and read paths (existing files:
   `get-<protocol>-position.ts`, `get-current-<protocol>-stop-loss.ts`, `simulations/`).
5. **get-triggers** — `summerfi-api/get-triggers-function/src/trigger-parsers/`: add decoding of the
   new trigger from automation-subgraph data so GET `/api/triggers` returns it (the function reads
   the automation subgraph and prices subgraph via `SUBGRAPH_BASE` and decodes trigger data with
   `@summerfi/abis` / viem).
6. **Stacks** — `stacks/triggers.ts`: no change needed: the routes are generic
   (`'GET /api/triggers'` and `'POST /api/triggers/{chainId}/{protocol}/{trigger}'`) and
   setup-trigger gets `GET_TRIGGERS_URL` injected so it can read existing triggers during
   validation. The on-chain AutomationBot/automation executor must support the new TriggerType for
   execution.

### Update a subgraph schema/query — legacy client packages (aave-spark, ajna, automation, morpho-blue, prices, summer-events)

1. **The `*-subgraph` package** — `packages/<pkg>/schema.graphql`: update the checked-in copy of the
   deployed subgraph's schema (the actual subgraph is defined and deployed outside this repo; this
   file is only the codegen input).
2. **Same package** — `packages/<pkg>/queries/*.graphql`: edit or add GraphQL operations.
3. **Same package** — `packages/<pkg>/graphql.config.yml`: run `pnpm generate-ts-types` (also runs
   automatically as prebuild) to regenerate `src/types/graphql/generated.ts` via graphql-codegen +
   typed-document-node.
4. **Same package** — `packages/<pkg>/src/index.ts`: update the hand-written wrapper (`getEndpoint`,
   `chainIdSubgraphMap`, exported `get*` functions) if new operations or chains were added.
5. **Consumers** — rebuild consumers (summerfi-api/external-api lambdas, triggers-calculations) —
   they pass `urlBase` from `process.env.SUBGRAPH_BASE` at runtime.

### Update a summer-earn-\* subgraph client (summer-earn-protocol-subgraph, summer-earn-rates-subgraph, summer-earn-institutions-subgraph)

1. **summer-earn-protocol repo (separate repo)** — the subgraph itself (`schema.graphql`,
   `subgraph.template.yaml`, mappings, graph codegen/build/deploy scripts) lives in the separate
   summer-earn-protocol repo under `packages/` with the SAME package names; change and deploy it
   there first.
2. **`@summerfi/summer-earn-*-subgraph` (this repo)** — `packages/<pkg>/codegen.yml`: codegen
   introspects the LIVE deployed endpoint: schema is `${SUBGRAPH_BASE}/<subgraph-name>` (e.g.
   `summer-protocol-hyperliquid`, `summer-earn-protocol-rates-hyperliquid`,
   `summer-institutions-base`), so `SUBGRAPH_BASE` must be set in the root `.env` (script runs
   `DOTENV_CONFIG_PATH=../../.env graphql-codegen`).
3. **Same package** — `packages/<pkg>/src/**/*.graphql`: edit query documents, then run
   `pnpm generate` to regenerate `src/generated/client.ts` (typescript-graphql-request `getSdk`);
   the generated file is committed.
4. **Same package** — `packages/<pkg>/src/utils/subgraphNameByChainMap.ts`: add/adjust the per-chain
   deployed subgraph name if a new chain deployment exists; `supportedChains` is derived from this
   map.
5. **Consumers** — consumers (`external-api/get-protocol-info-function`,
   `get-campaign-data-function`, `background-jobs/update-summer-earn-rewards-apr`,
   `summerfi-api/get-rates-function`, `apps/earn-protocol-institutions`, `app-server-handlers`,
   `app-earn-ui`) call `createClient(chainId, baseUrl)` / `getAllClients(baseUrl)` with `baseUrl`
   from `process.env.SUBGRAPH_BASE`.

### Add/modify a table in a Postgres DB package (summer-protocol-db, summer-institutions-db, summer-beach-club-db)

1. **`@summerfi/summer-protocol-db` (or institutions/beach-club variant)** —
   `packages/<pkg>/src/migrations/`: add a Kysely migration file.
2. **Same package** — `packages/<pkg>/src/scripts/local-migrate-*.ts`: run `pnpm migrate:latest` /
   `migrate:up` / `migrate:down` against a local DB (beach-club ships `docker-compose.yml`; its
   migrate scripts also re-run `pnpm codegen:kysely` to regenerate `src/database-types.ts`).
3. **Same package** — `packages/<pkg>/src/database-types.ts`: regenerate/maintain Kysely `Database`
   types (kysely-codegen for beach-club; summer-protocol-db and institutions-db keep
   `database-types.ts` in `src`).
4. **Consumers** — consumers create the client via `getSummerProtocolDB({connectionString})` — the
   connection string is passed in by the caller, e.g.
   `process.env.EARN_PROTOCOL_DB_CONNECTION_STRING` in `summerfi-api/get-rates-function` and other
   lambdas/apps.

### Update Armada (earn protocol v2) contract ABIs used by the SDK and apps

1. **`@summerfi/armada-protocol-abis`** —
   `armada-protocol/abis/src/<Contract>.sol/<Contract>.abi.json` + `.abi.ts`: drop in the new ABI
   JSON/TS for the contract (one folder per contract: FleetCommander, Ark, AdmiralsQuarters,
   SummerToken, etc.).
2. **Same package** — run `pnpm genindex` (uses cti) to regenerate the barrel `src/index.ts`, then
   `pnpm prebuild` to compile dist.
3. **Consumers** — sdk/\* services (armada-protocol-service, contracts-provider-service,
   abi-provider-service, sdk-client, sdk-e2e), apps/earn-protocol, apps/earn-protocol-institutions,
   external-api/get-campaign-data-function, background-jobs/update-tally-delegates pick up the new
   ABI types.

### Modify the legacy "operations" Solidity system or its deployment config

1. **`@summerfi/core-contracts`** — `packages/core-contracts/contracts/`: edit Solidity (core:
   OperationExecutor/OperationStorage/OperationsRegistry/ServiceRegistry; actions per protocol:
   aave, ajna, maker, morpho-blue, spark; swap; views).
2. **`@summerfi/deployment-configs`** — `packages/deployment-configs/src/`: adjust per-network
   deployment configuration (`configs.ts`, `mainnet/`, `localhost/`, `system/`) typed by
   `@summerfi/deployment-types`.
3. **`@summerfi/core-contracts`** — `packages/core-contracts/scripts/deploy.ts`: run hardhat
   scripts: `pnpm deploy-contracts`, `pnpm gen-versions` (`generate-versions.ts` hashes contracts
   via `@summerfi/contracts-utils` `getContractsHashes`), `pnpm view-versions`.
4. **`@summerfi/deployment-utils` / `@summerfi/hardhat-utils`** — shared deployment helpers and
   hardhat config utilities used by the above; sdk/\* packages (protocol-plugins,
   address-book-service, order-planner-service, sdk-server) consume the resulting addresses/types.

## SDK how-to docs

For step-by-step generator walkthroughs, see `sdk/docs/ADD_SDK_SERVICE.md` and
`sdk/docs/ADD_NEW_PLUGIN.md` rather than duplicating them here. For how to modify the SDK's
published GitBook docs — what's generated vs. hand-written, and the TSDoc rules TypeDoc enforces —
see `sdk/docs/DOCS_PLAYBOOK.md`.
