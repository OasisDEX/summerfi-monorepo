# @summerfi/armada-protocol-abis

Raw ABI JSON files and matching TypeScript const exports for the Armada (earn protocol v2) smart contracts. One folder per contract under `src/` (e.g. `FleetCommander.sol/`, `Ark.sol/`, `AdmiralsQuarters.sol/`), each containing `<Contract>.abi.json`, `<Contract>.abi.ts`, and a barrel `index.ts`.

**Consumers:** `@summerfi/armada-protocol-service`, `@summerfi/abi-provider-service`, `@summerfi/contracts-provider-service`, `@summerfi/sdk-client`, and the `earn-protocol` app.

## Updating an ABI

1. Drop the new `<Contract>.abi.json` and `<Contract>.abi.ts` into `src/<Contract>.sol/`.
2. Run `pnpm genindex` to regenerate `src/index.ts` via `cti`.
3. Run `pnpm prebuild` to compile `dist/`.

> **Gotcha:** `genindex` explicitly excludes `MockERC721.sol`, `ArkHelpers.sol`, `MockSummerToken.sol`, and any `build-info` or `.t.sol` folders. New mock/test contracts must be added to the exclusion list in `package.json` or they will be exported.
