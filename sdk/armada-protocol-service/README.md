# @summerfi/armada-protocol-service

The largest implementation package in the SDK. Provides `ArmadaManagerFactory` (vault/fleet
operations, staking V2, governance delegation, Merkl rewards, bridge, migrations, DCA), `RWAManager`
(rounds-vault deposits/withdrawals, whitelisting, exchange rates), `DeploymentProvider` with
`fetchPublicDeploymentProviderConfig` / `fetchInstiDeploymentProviderConfig` (contract-address
resolution per chain for public vs institutional deployments), `ArmadaSimulator`, and a
`db-provider` wrapping `@summerfi/summer-protocol-db`. SDK reference docs live in
`gitbook/reference`.

## Key exports

| Export                                | Purpose                                                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `ArmadaManagerFactory`                | Entry point; builds `ArmadaManager` for vault/fleet/staking/governance/rewards/bridge/migrations/DCA |
| `RWAManager`                          | Rounds-vault deposits, withdrawals, whitelisting, exchange rates                                     |
| `DeploymentProvider`                  | Resolves contract addresses per chain and deployment type                                            |
| `fetchPublicDeploymentProviderConfig` | Reads addresses from the bundled deployments JSON for public chains                                  |
| `fetchInstiDeploymentProviderConfig`  | Fetches institutional contract addresses from the subgraph at request time                           |
| `ArmadaSimulator`                     | Off-chain position simulation                                                                        |

## Scripts

```
pnpm build    # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm tsc      # tsc (emits output using tsconfig.json)
pnpm watch    # tsc -w
pnpm test     # jest (unit, --passWithNoTests)
pnpm e2e      # jest e2e/
pnpm lint     # eslint .
pnpm lint:fix # eslint . --fix
```

## Cross-package connections

**Layering**: sits in the service layer above `armada-protocol-common` (types/interfaces) and
`armada-protocol-abis` (ABIs), and below `sdk-server` / `sdk-client`, following the common/service
split used across the monorepo.

**Consumes**: `armada-protocol-common`, `armada-protocol-abis`, `allowance-manager-common/-service`,
`blockchain-client-common`, `contracts-provider-common/-service`, `oracle-common`,
`subgraph-manager-common/-service`, `swap-common/-service`, `tokens-common`, `summer-protocol-db`,
`configuration-provider-common`, `sdk-common`.

**Consumed by**: `sdk-server`, `sdk-client`, `sdk-e2e`.

**Gotchas**:

- `fetchInstiDeploymentProviderConfig` calls the subgraph at request time; if the institution record
  is missing the whole request returns no institutional config for that chain — not an error, just
  an empty result, so missing deployments are silent.
- `ArmadaManager` reads the `SUMMER_HUB_CHAIN_ID` env var to distinguish the hub chain from
  satellite chains; this must be set in any server or e2e environment.
- `fetchPublicDeploymentProviderConfig` depends on the deployments JSON bundled in
  `armada-protocol-common`; adding a new chain requires the protocol to be deployed and that JSON
  updated first.
- E2E tests expect `E2E_SDK_FORK_URL_<CHAIN>` env vars (pattern declared in `turbo.json`
  `globalEnv`) for each chain under test.
- Follow the `ark-development` skill guidance when touching Ark-related code.
