# @summerfi/abi-provider-common

Shared interface layer for ABI retrieval in the Summer.fi SDK. The package defines `IAbiProvider`
(the contract that every ABI-supplying implementation must satisfy), `AbiContractType` (an enum of
the three supported contract types: `ERC20`, `ERC4626`, and `ArmadaFleetCommander`), and the two
type aliases `ContractAbi` (a thin re-export of viem's `Abi`) and `ContractAbiRecord` (a full
`Record<AbiContractType, ContractAbi>` map). It contains no runtime logic — only types and the enum
— following the common/service split used throughout the SDK (common = contracts, service =
implementations). SDK reference docs live in `gitbook/reference`.

## Key exports

| Export              | Kind      | Description                                               |
| ------------------- | --------- | --------------------------------------------------------- |
| `IAbiProvider`      | interface | `getAbi({ type: AbiContractType }): Promise<ContractAbi>` |
| `AbiContractType`   | enum      | `ERC20 \| ERC4626 \| ArmadaFleetCommander`                |
| `ContractAbi`       | type      | Alias for viem `Abi`                                      |
| `ContractAbiRecord` | type      | `Record<AbiContractType, ContractAbi>`                    |

All four are re-exported from `src/index.ts`.

## Commands

```bash
pnpm build       # tsc -b --preserveWatchOutput tsconfig.build.json  (outputs to dist/)
pnpm watch       # tsc -w
pnpm lint        # eslint .
pnpm lint:fix    # eslint . --fix
```

There is no `test` script in `package.json`; the package has no tests of its own.

## Cross-package connections

**Consumes:** `@summerfi/sdk-common` (workspace dep; provides the broader SDK type foundation).
`ContractAbi` imports `Abi` directly from `viem`, which is available transitively through
`@summerfi/sdk-common` — `viem` is not declared as a direct dependency of this package.

**Consumed by** (verified via each package's `package.json`):

- `@summerfi/abi-provider-service` — implements `IAbiProvider`
- `@summerfi/contracts-provider-common` — uses the types in its own interface layer
- `@summerfi/contracts-provider-service` — uses the types in its service implementation
- `@summerfi/sdk-server` — wires the provider into the server runtime

**Gotchas:** The `exports` map in `package.json` points at `src/index.ts` (not `dist/`), so
consumers resolve source directly in dev; run `pnpm build` before publishing or running in an
environment that requires compiled output.
