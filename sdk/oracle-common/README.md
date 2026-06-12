# @summerfi/oracle-common

Shared interface layer for oracle price lookups in the Summer.fi SDK. This package defines
`IOracleManager` and `IOracleProvider` — the two contracts that every oracle integration must
satisfy — so that higher-level services depend on abstractions rather than concrete provider
implementations. It sits at the common/service boundary: types and interfaces only, no runtime
logic.

## Key exports

| Export            | Description                                                                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IOracleManager`  | Top-level manager; selects the appropriate provider and exposes `getSpotPrice` (single token) and `getSpotPrices` (batch, by chain). Extends `IManagerWithProviders` from `sdk-server-common`. |
| `IOracleProvider` | Per-provider plugin contract; implements the same `getSpotPrice` / `getSpotPrices` signatures for a specific `OracleProviderType`.                                                             |

Entry point: `src/index.ts` (workspace import) / `dist/index.js` (built).

## Commands

```bash
pnpm build       # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm tsc         # plain tsc check
pnpm watch       # tsc -w
pnpm lint        # eslint .
pnpm lint:fix    # eslint . --fix
```

There are no test scripts in this package's `package.json`.

## Cross-package connections

**Consumes:** `@summerfi/sdk-common` (token/price types: `IToken`, `ISpotPriceInfo`,
`SpotPricesInfo`, `OracleProviderType`, `Denomination`, `FiatCurrency`, `IChainInfo`),
`@summerfi/sdk-server-common` (manager/provider base interfaces: `IManagerWithProviders`,
`IManagerProvider`).

**Consumed by:** `oracle-service`, `armada-protocol-service`, `order-planner-service`,
`protocol-plugins`, `protocol-plugins-common`, `simulator-service`, `testing-utils`, `sdk-server`.

**Gotchas:**

- This package exports TypeScript types only (`export type`). Consumers must have
  `@summerfi/sdk-common` and `@summerfi/sdk-server-common` available at their own resolution scope;
  there is no runtime code here to import.
- No codegen step. If `sdk-common` adds new price-related types, hand-edit the interfaces here and
  rebuild dependent packages.

Full SDK reference docs live in `gitbook/reference`.
