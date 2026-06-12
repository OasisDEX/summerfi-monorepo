# @summerfi/armada-protocol-common

Interface and type layer for the Armada (Lazy Summer) protocol. This package defines the
`IArmadaManager` family of interfaces (vaults, positions, governance, claims, bridge, migrations,
access control, admin, DCA, RWA, Merkl rewards), deployment address helpers keyed on `sumr.json` /
`bummer.json` config files, order parameter types (`IArmadaParameters`), simulator types
(`IArmadaSimulation`, `IArmadaSimulatedPosition`), and Merkl API response types. It sits in the
common/service layering as a pure-interface package — no runtime service logic lives here; that
belongs in `armada-protocol-service`. SDK reference docs live in `gitbook/reference`.

## Key exports

| Export                                                                                  | Description                                                                                                                                       |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IArmadaManager` (and sub-interfaces)                                                   | Full manager interface split across governance, claims, vaults, bridge, positions, admin, access control, DCA, RWA, Merkl rewards, and migrations |
| `setTestDeployment(deployment)`                                                         | Mutates module-level `_deployment` singleton to `"SUMMER"` or `"BUMMER"`; must be called before any address helper                                |
| `getDeploymentConfigContractAddress`                                                    | Resolves a deployed contract address from the active JSON config by chain + category + name                                                       |
| `getAaveV3Address`, `getCompoundV3Address`, `getLayerZeroConfig`                        | Protocol-specific address/config helpers backed by the same singleton                                                                             |
| `IArmadaParameters` / `ArmadaParametersDataSchema`                                      | Order input types with Zod schema and type guard                                                                                                  |
| `IArmadaSimulation` / `IArmadaSimulatedPosition`                                        | Simulator output types with Zod schemas and type guards                                                                                           |
| `createDepositTransaction`, `createWithdrawTransaction`, `createVaultSwitchTransaction` | Transaction builder utilities                                                                                                                     |
| `getAllDistributionClaims`                                                              | Distributions helper                                                                                                                              |

## Commands

```bash
pnpm build          # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm tsc            # plain tsc type-check
pnpm watch          # tsc -w
pnpm lint           # eslint .
pnpm lint:fix       # eslint . --fix
pnpm declarations   # emit .d.ts only (tsconfig.bundle.json)
```

No `test` script is defined in this package.

## Cross-package connections

**Consumes:** `@summerfi/sdk-common`, `@summerfi/contracts-provider-common`,
`@summerfi/subgraph-manager-common` (subgraph query types are re-exported directly from here).

**Consumed by:** `armada-protocol-service`, `contracts-provider-service`, `order-planner-common`,
`order-planner-service`, `simulator-service`, `sdk-client`, `sdk-server`, `sdk-e2e`.

**Gotchas:**

- `setTestDeployment("SUMMER" | "BUMMER")` writes to a module-level singleton (`_deployment`). Every
  address helper (`getDeploymentConfigContractAddress`, `getDeploymentsJsonConfig`, etc.) reads that
  singleton at call time. Calling it in one part of a service process affects the entire process; it
  must be called before any address lookup or an error is thrown.
- Deployment addresses are hand-maintained in `src/deployments/sumr.json` and
  `src/deployments/bummer.json`. When contracts are redeployed, these JSON files must be updated
  manually and all consuming services rebuilt.
- The `declarations` script uses a separate `tsconfig.bundle.json`; run it explicitly when
  publishing type-only declaration bundles.
