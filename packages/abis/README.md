# @summerfi/abis

Typed ABI constants for external protocol contracts used by the Summer.fi SDK.

Covers: Aave Oracle, Aave Pool Data Provider, Account Implementation, Automation Bot, Chainlink Pair Oracle, ERC-20, and Morpho Blue.

Each ABI is exported as a named TypeScript `const` array from `src/index.ts` (e.g. `aaveOracleAbi`, `morphoBlueOracleAbi`).

**Consumers:** `@summerfi/triggers-calculations`, `@summerfi/protocol-plugins`, `@summerfi/get-triggers-function`, `setup-trigger`.

**Note on exports:** The `exports` field points directly at `src/index.ts`, so workspace consumers resolve TypeScript source (the monorepo handles this via `workspace:*` + `paths` in tsconfig). The package does have a `build` script (`tsc -b`) that emits compiled output to `dist/`, but the `exports` map does not reference it.

**Note:** Armada (earn protocol v2) contract ABIs live in the separate `@summerfi/armada-protocol-abis` package, not here.
