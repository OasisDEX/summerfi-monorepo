# @summerfi/address-book-service

Service-layer implementation of the address book: `AddressBookManager` resolves contract and
dependency addresses by looking them up in the `@summerfi/core-contracts` `Deployments` index (typed
as `DeploymentIndex` from `@summerfi/deployment-utils`). Given a chain and a contract name it builds
a lookup key of `${chainInfo.name}.${deploymentTag}` — where `deploymentTag` is hardcoded to
`"standard"` by `AddressBookManagerFactory` — and searches the matching deployment's `contracts` and
`dependencies` maps. The interface contract lives in `@summerfi/address-book-common`; this package
provides the concrete classes.

## Key exports (`src/index.ts`)

| Export                      | Role                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| `AddressBookManager`        | Implements `IAddressBookManager`; `getAddressByName` performs the keyed lookup                   |
| `AddressBookManagerFactory` | Static factory; call `newAddressBookManager({ configProvider })` to get an `IAddressBookManager` |

## Commands

| Script          | What it does                                       |
| --------------- | -------------------------------------------------- |
| `pnpm build`    | `tsc -b --preserveWatchOutput tsconfig.build.json` |
| `pnpm watch`    | `tsc -w`                                           |
| `pnpm test`     | `jest tests/ --coverage=true`                      |
| `pnpm testw`    | `jest --watch`                                     |
| `pnpm e2e`      | `jest e2e/`                                        |
| `pnpm lint`     | `eslint .`                                         |
| `pnpm lint:fix` | `eslint . --fix`                                   |

## Cross-package connections

**Consumes:** `@summerfi/address-book-common` (interface), `@summerfi/core-contracts` (Deployments
index), `@summerfi/deployment-utils` (DeploymentIndex type),
`@summerfi/configuration-provider-common` (IConfigurationProvider passed to factory),
`@summerfi/sdk-common` (IChainInfo, IAddress, Address).

**Consumed by:** `@summerfi/sdk-server` (wires `AddressBookManagerFactory` into the server service
graph). The common/service split follows the SDK layering convention: shared interfaces in
`*-common`, implementations here in `*-service`. SDK reference docs live in `gitbook/reference`.

**Gotchas:**

- `deploymentTag` is hardcoded to `"standard"` inside
  `AddressBookManagerFactory.newAddressBookManager`; there is no runtime override.
- The lookup key is `${chainInfo.name}.standard`. `ChainInfo.name` (sourced from `ChainFamilies.ts`
  in `@summerfi/sdk-common`) must match the key used when the protocol was indexed in
  `@summerfi/core-contracts` — a mismatch causes a TypeError at runtime because `deployment` is
  accessed without a null guard.
- Adding a new chain requires the protocol to be deployed and present in `@summerfi/core-contracts`
  `Deployments` under the correct key before this package can resolve any addresses for it.
