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
