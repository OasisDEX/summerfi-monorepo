# @summerfi/address-book-common

Shared interface layer for the Summer.fi address book. The package exports `IAddressBookManager`,
which defines the contract for resolving a named contract address on a given chain. It carries no
runtime logic — concrete lookup behaviour lives in `address-book-service`. This is the common half
of the common/service layering used throughout the SDK; SDK reference docs live in
`gitbook/reference`.

## Key exports

| Export                | Description                                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `IAddressBookManager` | Single-method interface: `getAddressByName({ chainInfo, name })` → `Promise<Maybe<IAddress>>`. Use this for Summer deployment addresses and system-dependency addresses. For tokens, use `ITokensManager` instead. |

## Scripts

```bash
pnpm build       # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm tsc         # plain type-check
pnpm watch       # tsc -w
pnpm lint        # eslint .
pnpm lint:fix    # eslint . --fix
```

There is no `test` script in this package — it contains only interface definitions.

## Cross-package connections

**Consumes:** `@summerfi/sdk-common` (`Maybe`, `IChainInfo`, `IAddress`).

**Consumed by:** `address-book-service` (implements `IAddressBookManager`); `order-planner-common`,
`order-planner-service`, `protocol-plugins-common`, `protocol-plugins`, `testing-utils`, and
`sdk-server` all import the interface to type their own address-book dependencies.

**Gotchas:** This package contains hand-maintained interface definitions only — there are no
code-generation steps. If you add or change a method signature here, every implementation and
consumer listed above must be updated manually.
