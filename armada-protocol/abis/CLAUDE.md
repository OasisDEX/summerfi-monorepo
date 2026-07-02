# armada-protocol-abis — cross-package dependencies

Raw ABI JSON + matching TypeScript const exports for the Armada (earn protocol v2) contracts. This
is a **leaf** package (imports no `@summerfi/*` code) but a widely-consumed one whose real value is
a **generated, committed barrel of runtime ABI values** — not just types. This file documents the
off-repo source-of-truth coupling and the `genindex` config coupling, both of which drift silently.

## Where the ABIs come from (off-repo source of truth)

The ABI files are **hand-copied in**, not generated in this repo. The upstream Solidity lives in the
`summer-earn-protocol` repo, wired here as the git submodule `armada-protocol/contracts`
(`.gitmodules` → `git@github.com:OasisDEX/summer-earn-protocol.git`). There is **no automated copy
step** — someone drops updated `<Contract>.abi.json` / `.abi.ts` into `src/<Contract>.sol/` by hand.

Consequence: the ABIs here can drift from (a) the upstream contract source and (b) the actually
deployed on-chain bytecode. Because consumers use the exported ABIs as **runtime values** for viem
`readContract` / `encodeFunctionData`, a stale ABI produces decode/encode failures or silently wrong
calls — not a TypeScript error. Contract addresses come from a **different** source
(`armada-protocol-service` deployment-provider + `@summerfi/core-contracts` `Deployments`), so an ABI
here and the address it is used against can be updated independently.

## Consumers (all import the barrel `@summerfi/armada-protocol-abis`, no subpaths)

| Consumer                              | Uses ABIs for                                                        |
| ------------------------------------- | ------------------------------------------------------------------- |
| `contracts-provider-service`          | Typed contract wrappers (`FleetCommanderContract`, `ArkContract`, `AdmiralsQuartersContract`, `RoundsVaultContract`, `ConfigurationManagerContract`, `SummerStakingContract`, access-manager contracts) |
| `armada-protocol-service`             | `ArmadaManager*` (vaults, claims, bridge, migrations, governance, merkl rewards) |
| `abi-provider-service`                | `AbiProvider` returns raw ABIs by contract name                     |
| `earn-protocol` (app)                 | Server handlers: share-price, fleet-fees, sumr-balances/-staking/-delegate, decay-factor |
| `earn-protocol-institutions` (app)    | Institution vaults server handler                                   |
| `get-campaign-data-function` (external-api) | Campaign/rewards reads                                         |
| `update-tally-delegates` (background-jobs)  | SUMR decay-factor read                                         |
| `sdk-e2e`                             | e2e tests                                                            |

`sdk-client` **declares** the dep in `package.json` but does **not** import it anywhere in `src` —
stale; safe to drop.

Every consumer imports the root barrel (`from '@summerfi/armada-protocol-abis'`, resolving to
`dist/index.js`). Nothing imports the `./*` subpath export, even though `package.json` exposes it.

## The `genindex` config coupling

`src/index.ts` is **generated and committed** — do not hand-edit it. It is produced by the
`genindex` script (`cti`, create-ts-index) in `package.json`:

```
genindex: rm -f src/index.ts && for dir in ./src/*; do cti create ./$dir -b -w; done
          && cti ./src -b -w -e '.t.sol' -e 'build-info' -e 'MockERC721.sol'
          -e 'ArkHelpers.sol' -e MockSummerToken.sol
```

Gotchas:

- The **exclusion list is inline in the `package.json` script**, not a config file. Any new
  mock/test/helper contract folder must be added to the `-e` flags or it gets exported into the
  public barrel (and into `dist`).
- The barrel is committed; consumers get whatever was last generated. After adding/removing a
  contract folder you must re-run `pnpm genindex` **and** commit the regenerated `src/index.ts`, then
  `pnpm prebuild` to refresh `dist/`. Forgetting either means consumers silently see the old set of
  exports.
- `cti -b` is a barrel of `export *` across folders — two contracts exporting a same-named symbol
  would collide. Keep the per-`.sol` export names unique.

## Updating an ABI — checklist

1. Update the upstream contract in `summer-earn-protocol` and (re)deploy if the on-chain contract
   changed. Sync the `armada-protocol/contracts` submodule if you use it as the source.
2. Drop the new `<Contract>.abi.json` and `<Contract>.abi.ts` into `src/<Contract>.sol/`.
3. Adding a brand-new contract that is a mock/test/helper? Add it to the `genindex` `-e` exclusions.
4. `pnpm genindex` → regenerates `src/index.ts`; **commit it**.
5. `pnpm prebuild` → recompiles `dist/`.
6. Verify the ABI matches the deployed bytecode for every chain the contract runs on — a mismatch is
   a runtime, not compile-time, failure in consumers.

## Notes

- No `process.env` reads, no stack wiring — this package is pure data + tooling.
- The `./*` subpath export (`./src/*/index.js`) is currently unused by any consumer; the root barrel
  is the de facto API surface.
