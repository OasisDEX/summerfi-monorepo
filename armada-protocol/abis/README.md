# @summerfi/armada-protocol-abis

Raw ABI JSON files and matching TypeScript const exports for the Armada (earn protocol v2) smart contracts. One folder per contract under `src/` (e.g. `FleetCommander.sol/`, `Ark.sol/`, `AdmiralsQuarters.sol/`), each containing `<Contract>.abi.json`, `<Contract>.abi.ts`, and a barrel `index.ts`.

**Consumers:** `@summerfi/armada-protocol-service`, `@summerfi/abi-provider-service`, `@summerfi/contracts-provider-service`, `@summerfi/sdk-client`, and the `earn-protocol` app.

## Updating an ABI

1. Drop the new `<Contract>.abi.json` and `<Contract>.abi.ts` into `src/<Contract>.sol/`.
2. Run `pnpm genindex` to regenerate `src/index.ts` via `cti`.
3. Run `pnpm prebuild` to compile `dist/`.

> **Gotcha:** `genindex` explicitly excludes `MockERC721.sol`, `ArkHelpers.sol`, `MockSummerToken.sol`, and any `build-info` or `.t.sol` folders. New mock/test contracts must be added to the exclusion list in `package.json` or they will be exported.

## Cross-package connections

**Consumes:** nothing — leaf package. It imports no `@summerfi/*` code; the only deps are build tooling (`@summerfi/eslint-config`, `@summerfi/typescript-config`).

**Consumed by:** `armada-protocol-service`, `contracts-provider-service`, `abi-provider-service`, `sdk-e2e`, `get-campaign-data-function` (external-api), `update-tally-delegates` (background-jobs), and the `earn-protocol` / `earn-protocol-institutions` apps. All import the root barrel `@summerfi/armada-protocol-abis` (resolving to `dist/index.js`) — no consumer uses the `./*` subpath export. `sdk-client` declares the dep in `package.json` but never imports it (stale).

**Gotchas:**

- Consumers read the **generated, committed barrel `src/index.ts`** (via `dist/`) as **runtime ABI values**, not just types. After adding/removing a contract folder you must re-run `pnpm genindex`, commit the regenerated `src/index.ts`, then `pnpm prebuild` — otherwise consumers silently see the old export set.
- ABIs are **hand-copied** from the off-repo `summer-earn-protocol` source (git submodule `armada-protocol/contracts`); there is no automated copy step. They can drift from the deployed on-chain bytecode, and contract addresses come from a different source (`armada-protocol-service` deployment-provider + `@summerfi/core-contracts` `Deployments`) — a stale ABI is a runtime decode/encode failure, not a tsc error.
- See `CLAUDE.md` for the full cross-package / off-repo / `genindex` coupling and the update checklist.
