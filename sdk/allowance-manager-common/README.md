# @summerfi/allowance-manager-common

Interface layer for ERC-20 token approvals and Permit2 flows in the Summer.fi SDK. The package
exports a single TypeScript interface, `IAllowanceManager`, that defines the contract for generating
approval transactions and Permit2-related typed-data payloads. It contains no runtime logic; the
concrete implementation lives in `allowance-manager-service`. This common/service split keeps
consumers decoupled from the implementation at compile time. SDK reference docs live in
`gitbook/reference`.

## Key exports

| Export              | Description                                                                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `IAllowanceManager` | Interface covering `getApproval`, `isPermit2AuthorizationNeeded`, `getPermit2AuthorizationTx`, `getPermit2RevokeTx`, and `getPermit2Data` |

Entry point: `src/index.ts` (source) / `dist/index.js` (built).

## Commands

```bash
pnpm build       # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm watch       # tsc -w (incremental watch)
pnpm lint        # eslint .
pnpm lint:fix    # eslint . --fix
```

There is no `test` script in `package.json`.

## Cross-package connections

**Consumes:** `@summerfi/sdk-common` — imports `IAddress`, `IChainInfo`, `ITokenAmount`, `ChainId`,
`AddressValue`, `ApproveTransactionInfo`, `Permit2AuthorizationTransactionInfo`,
`Permit2RevokeTransactionInfo`, `Permit2PermitData`.

**Consumed by:** `allowance-manager-service` (implementation), `armada-protocol-service`,
`swap-service`, `sdk-server`.

**Gotchas:** This package is interface-only — adding a method to `IAllowanceManager` requires
updating the implementation in `allowance-manager-service` and any other service that constructs a
conforming object. There are no env vars, no codegen steps, and no hand-maintained data files in
this package.
