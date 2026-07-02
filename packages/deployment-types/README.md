# @summerfi/deployment-types

Shared TypeScript type definitions for on-chain deployment configuration across the Summer.fi
monorepo.

## What it is

Exports the `Config` type and its constituent parts: `SystemConfig` (core contracts, actions,
automation), `DependenciesConfig` (misc and token addresses), and `ProtocolsConfig` (Aave V2/V3,
Spark, Ajna, Maker, Morpho Blue). Also exports `ConfigEntry`, `ActionNames`, and the `isConfigEntry`
type-guard utility.

## Who uses it

Any package that reads or writes deployment config objects — deployment scripts, address-registry
helpers, and integration tests that need to reference protocol or system contract addresses.

## Scripts

| Script              | Description                 |
| ------------------- | --------------------------- |
| `build`             | `tsc -b` compile to `dist/` |
| `dev`               | Watch-mode TypeScript build |
| `lint` / `lint:fix` | ESLint                      |

## Gotcha

The `package.json` `exports` map points at `./src/index.ts` for the `import` condition, so consumers
in the monorepo import directly from source; the compiled `dist/` is used only by external consumers
via the `main` field.

## Cross-package connections

**Consumes:** `@summerfi/common` (only `Address`, imported in `src/dependencies/tokens.ts` and
`src/dependencies/misc.ts`). Note: `@summerfi/common` is declared under `devDependencies` but is
imported from production source — it works because the monorepo resolves the `import` condition to
TypeScript source, but it should really be a regular dependency. Build tooling only:
`@summerfi/eslint-config`, `@summerfi/typescript-config`.

**Consumed by:** `deployment-configs` (every file under `src/mainnet/`, `src/localhost/`, `src/system/`
imports `Config`/`SystemConfig`/`ProtocolsConfig`/`ConfigEntry` to type the hand-written address
tables), `core-contracts` (`src/lib/deployment/*.ts` — deployment/verification scripts), and
`protocol-plugins` + `protocol-plugins-common` (AddressAbiMap types, plugin `Types.ts`, and
`protocol-plugins-common/src/actions/Types.ts` which keys off `ActionNames`). Declared but NOT
imported in source (stale `package.json` deps): `order-planner-service`, `protocol-manager-common`,
`protocol-manager-service`, `testing-utils`.

**Gotchas:**

- `ActionNames` (`src/common/actionNames.ts` = `SystemActionNames | ProtocolActionNames`, defined in
  `src/system/actions.ts` and `src/protocols/*.ts`) is a hand-maintained string-literal union of the
  legacy operations action contract names. It must stay in sync with the actual deployed action
  contracts in `core-contracts` (`packages/core-contracts/contracts/actions/**`) and the names used
  in `deployment-configs` (`src/*/system/actions.conf.ts`). Adding an on-chain action means adding
  its literal here or the config table won't type-check.
- Pure types package: no `process.env`, no stack wiring, no codegen. Changing a type here is a
  compile-time break in `deployment-configs` and `core-contracts` first — run their builds after any
  edit.
- Leaf on the runtime side: nothing here emits or reads generated artifacts; coupling is entirely via
  the exported TypeScript types.
