# @summerfi/deployment-configs

Hand-maintained, per-network deployment configuration for the legacy Solidity operations system. The
package exports typed constant objects — covering core contracts, actions, automation, protocol
addresses, and dependencies — for the `mainnet` and `localhost` networks. A
`loadDeploymentConfig(network)` helper lets consumers look up the right `Config` object at runtime
without importing every network variant directly.

## Key exports

| Export                 | Source                  | Description                                                                                       |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| `loadDeploymentConfig` | `src/utils.ts`          | Function: `(network: ChainsType) => Config \| undefined`                                          |
| `MainnetConfig`        | `src/mainnet/conf.ts`   | Full `Config` for Ethereum mainnet (system + protocols + dependencies)                            |
| `LocalhostConfig`      | `src/localhost/conf.ts` | Full `Config` for local Hardhat network                                                           |
| `SystemConfiguration`  | `src/system/system.ts`  | `SystemConfig` composed of `CoreConfiguration`, `ActionsConfiguration`, `AutomationConfiguration` |

`DeploymentConfig` (`ConfigMap` keyed by network) and `ConfigMap` are defined in `src/configs.ts`
but are **not re-exported** from `src/index.ts` — they are internal to the package.

## Commands

```bash
pnpm build      # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm dev        # tsc -b --preserveWatchOutput tsconfig.build.json -w  (watch mode)
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

There is no `test` script in this package.

## Cross-package connections

**Consumes**

- `@summerfi/deployment-types` — provides the `Config`, `SystemConfig`, and related type interfaces
  that all exported constants must satisfy.
- `@summerfi/deployment-utils` — supplies the `DeploymentChain` enum used in `ConfigMap`.
- `@summerfi/hardhat-utils` — provides the `ChainsType` union used as the `loadDeploymentConfig`
  parameter type.
- `@summerfi/common` — listed as a dev dependency; not directly imported in any source file.

**Consumed by**

- `@summerfi/core-contracts` — the only other workspace package that declares this as a dependency
  (verified via `package.json` search).

**Gotchas**

- All configuration is **hand-maintained source code** — there is no codegen step. Adding or
  renaming a deployed contract address requires editing the relevant file under `src/mainnet/`,
  `src/localhost/`, or `src/system/` directly, then rebuilding.
- Protocol-specific addresses live in individual files under `src/mainnet/protocols/` (e.g.
  `aaveV2.ts`, `aaveV3.ts`, `maker.ts`, `morphoblue.ts`, `spark.ts`, `ajna.ts`) and are aggregated
  in `protocols.ts`. Token and miscellaneous addresses are split across `src/mainnet/dependencies/`.
- The package has no runtime dependencies — only `devDependencies`. Consuming packages must ensure
  `@summerfi/deployment-types` is in their own dependency tree for the types to resolve correctly.
