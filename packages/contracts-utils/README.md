# @summerfi/contracts-utils

Utility library for hashing compiled Hardhat/Solidity contract artifacts. Given a running Hardhat
Runtime Environment, it reads all fully-qualified artifact names, computes a `keccak256` hash of
each contract's bytecode via `viem`, and returns a keyed map — enabling deterministic change
detection and deployment validation across the monorepo.

## Key exports

| Export                                         | Description                                                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `getContractsHashes(params?)`                  | Async function; accepts an optional `exclusions` string array, returns `Promise<ContractsHashMap>` |
| `ContractInfo`                                 | `{ name, path, hash }` — single contract entry                                                     |
| `ContractsHashMap`                             | `Record<ContractName, ContractInfo>` — full hash map                                               |
| `ContractHash`, `ContractName`, `ContractPath` | Plain string type aliases                                                                          |

Entry point: `dist/index.js` / `dist/index.d.ts` (built from `src/index.ts`).

## Commands

```bash
pnpm build       # tsc -b --preserveWatchOutput -v (compile to dist/)
pnpm dev         # tsc -b --preserveWatchOutput -w
pnpm lint        # eslint .
pnpm lint:fix    # eslint . --fix
```

There is no test script in `package.json`.

## Cross-package connections

**Consumes**

- `hardhat` (HRE + artifact API) — must be invoked from within a Hardhat project context
- `viem` — `keccak256` / `toBytes` for bytecode hashing
- `@summerfi/hardhat-utils` (dev dep)

**Consumed by**

- `@summerfi/core-contracts` — real importer: `getContractsHashes` used in
  `src/lib/versions/{types,utils}.ts` (the `gen-versions` path)
- `@summerfi/deployment-utils` — declares this in `package.json` but no longer imports it in `src`
  (stale dependency)

**Gotchas**

- `getContractsHashes` calls `hre.artifacts` at runtime; artifacts must be compiled
  (`hardhat compile`) before this function is called, or it will return an empty map.
- The function is async but uses `readArtifactSync` inside `reduce` — callers must `await` the outer
  promise before using the result.
- No `format:fix` script exists in this package; `lint:fix` covers auto-fixable ESLint issues only.
