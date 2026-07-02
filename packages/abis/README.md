# @summerfi/abis

Typed ABI constants for external protocol contracts used by the Summer.fi SDK.

Covers: Aave Oracle, Aave Pool Data Provider, Account Implementation, Automation Bot, Chainlink Pair Oracle, ERC-20, and Morpho Blue.

Each ABI is exported as a named TypeScript `const` array from `src/index.ts` (e.g. `aaveOracleAbi`, `morphoBlueOracleAbi`).

**Note on exports:** The `exports` field points directly at `src/index.ts`, so workspace consumers resolve TypeScript source (the monorepo handles this via `workspace:*` + `paths` in tsconfig). The package does have a `build` script (`tsc -b`) that emits compiled output to `dist/`, but the `exports` map does not reference it.

**Note:** Armada (earn protocol v2) contract ABIs live in the separate `@summerfi/armada-protocol-abis` package, not here.

## Cross-package connections

**Consumes:** nothing — the ABI consts are hand-written literal arrays with no `@summerfi/*` imports. Build/lint tooling only (`@summerfi/eslint-config`, `@summerfi/typescript-config`).

**Consumed by:**

- `protocol-plugins` — `sdk/protocol-plugins/src/plugins/morphoblue/` (`MorphoProtocolPlugin.ts`, `types/MorphoAddressAbiMap.ts`) imports `morphoBlueAbi` / oracle ABIs.
- `setup-trigger-function` — every trigger encoder under `src/services/trigger-encoders/` plus `encode-function-for-dpm.ts` and `automation-bot-helper.ts` import `accountImplementationAbi` / `automationBotAbi` and the per-protocol ABIs to viem-encode trigger add/remove calldata.
- `triggers-calculations` — `get-aave-position.ts`, `get-spark-position.ts`, `get-morphoblue-position.ts` import the Aave/Morpho ABIs for on-chain reads.

**Gotchas:**

- ABIs are consumed as **runtime data**, not just types: consumers pass these arrays straight to viem's `encodeFunctionData` / `readContract`. A drift between an ABI here and the actually-deployed contract silently produces wrong calldata or decode failures at runtime — there is no codegen or on-chain check tying this file to the real contract. Update the ABI here whenever the corresponding external contract (Aave Pool Data Provider, Automation Bot, Morpho Blue, DPM account implementation, Chainlink pair oracle) changes.
- `summerfi-api/get-triggers-function/package.json` declares `@summerfi/abis` but nothing under its `src/` imports it — a **stale devDep**; the live trigger-decoding path is in `setup-trigger-function` and `triggers-calculations`.
- This package is Armada-agnostic: earn-protocol-v2 contract ABIs live in `@summerfi/armada-protocol-abis` (regenerated via `pnpm genindex`). Do not add Armada ABIs here.
