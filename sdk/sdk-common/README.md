# @summerfi/sdk-common

Foundation types, value objects, enums, and services shared by every package in the Summer.fi SDK.
If a concept is used across more than one SDK package — chains, tokens, positions, protocols,
simulation, oracle, swap, orders — its canonical definition lives here. The common/service layering
means this package owns the domain model; higher-level packages own the behavior.

## Key exports

| Export                                                                   | What it is                                                                                                                                                                                               |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Address`, `Token`, `TokenAmount`, `ChainInfo`                           | Core value objects                                                                                                                                                                                       |
| `ChainIds`, `LegacyChainIds`                                             | Single source of truth for supported numeric chain IDs (Mainnet 1, Base 8453, ArbitrumOne 42161, Sonic 146, Hyperliquid 999); `ChainId` type and `ChainIdSchema`/`isChainId` are derived from `ChainIds` |
| `ChainFamilyMap`, `getChainInfoByChainId`, `getChainFamilyInfoByChainId` | Chain family registry; throws `'Chain with id X not supported'` for any unmapped ID                                                                                                                      |
| `chainIdToGraphChain`                                                    | Maps a chain ID to its subgraph slug (`mainnet`/`base`/`arbitrum`/`sonic`/`hyperliquid`); also used as the `network` param for RPC gateway URLs                                                          |
| `getViemChain`, `hyperliquid`                                            | Resolves a viem chain definition; HyperEVM (id 999) is hand-defined with `defineChain` because viem does not bundle it                                                                                   |
| `ProtocolName`, `PoolType`, `PositionType`                               | Protocol/pool/position enums                                                                                                                                                                             |
| `CommonTokenSymbols`                                                     | Optional convenience enum for well-known token symbols (`TokenSymbol` itself is `type TokenSymbol = string`)                                                                                             |
| `SerializationService`                                                   | SuperJSON-backed transformer used as the tRPC serializer across the RPC boundary                                                                                                                         |
| `LoggingService`                                                         | Shared logger                                                                                                                                                                                            |

Full API reference: `gitbook/reference`.

## Commands

```sh
pnpm build         # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm test          # jest --coverage=true
pnpm testw         # jest --watch
pnpm lint          # eslint .
pnpm lint:fix      # eslint . --fix
pnpm check-circular  # madge --circular --extensions ts ./src: circular imports are a real risk in this package
pnpm bundle:npm    # esbuild CJS bundle + declarations (for npm publish)
```

## Cross-package connections

**Consumes:** `@summerfi/common` (root `/packages`), `zod`, `viem`, `superjson`,
`@cowprotocol/cow-sdk`

**Consumed by:** effectively every `sdk/*` package and all apps that work with SDK domain objects.

**Gotchas:**

- `src/common/implementation/ChainIds.ts` is the single source of truth for supported chains. Adding
  a chain requires updating four files in sequence: `ChainIds.ts` (register the ID),
  `ChainFamilies.ts` (add the family entry), `chainIdToGraphChain.ts` (add the slug), and
  `getViemChain.ts` (add the viem chain; use `defineChain` if not bundled in `viem/chains`).
- `LegacyChainIds` includes Optimism (10) marked "not supported yet" — it is intentionally excluded
  from `ChainIds`.
- Adding a new protocol requires adding it to the `ProtocolName` enum in
  `src/common/enums/ProtocolName.ts` before the plugin package can reference it.
- Run `pnpm check-circular` after any structural refactor — circular imports have occurred here
  before.
