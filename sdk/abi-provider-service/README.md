# @summerfi/abi-provider-service

Service-layer implementation of the ABI provider pattern. The package exposes `AbiProvider`
(implements `IAbiProvider` from `abi-provider-common`) and `AbiProviderFactory`, which instantiates
it. At runtime the provider holds a fixed in-memory `ContractAbiRecord` containing exactly three
ABIs: `erc20Abi` and `erc4626Abi` sourced from viem, and `FleetCommanderAbi` from
`@summerfi/armada-protocol-abis`. This package is the _service_ half of the common/service split —
interfaces and types live in `abi-provider-common`. SDK reference docs live in `gitbook/reference`.

## Key exports

| Export               | Description                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| `AbiProvider`        | Concrete `IAbiProvider`; resolves `AbiContractType` to a `ContractAbi` |
| `AbiProviderFactory` | Static `newAbiProvider({ configProvider })` factory method             |

## Scripts

```
pnpm build        # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm tsc          # tsc (emits to dist via tsconfig.json)
pnpm watch        # tsc -w
pnpm lint         # eslint .
pnpm lint:fix     # eslint . --fix
```

There is no `test` script in this package.

## Cross-package connections

**Consumes**

- `@summerfi/abi-provider-common` — `IAbiProvider`, `AbiContractType`, `ContractAbi`,
  `ContractAbiRecord`
- `@summerfi/armada-protocol-abis` — `FleetCommanderAbi`
- `@summerfi/configuration-provider-common` — `IConfigurationProvider` (injected into constructor)
- `@summerfi/sdk-common` (transitive peer)

**Consumed by**

- `@summerfi/sdk-server` — wires the factory into the server's DI composition root

**Gotchas**

- Only three ABI types exist (`ERC20`, `ERC4626`, `ArmadaFleetCommander`). ABIs for protocol plugins
  live inside the individual protocol-plugin packages, not here.
- `configProvider` is injected into `AbiProvider` but is not currently used for ABI resolution; the
  ABI record is built unconditionally at construction time.
- No codegen or environment variables are required — the ABI set is fully static.
