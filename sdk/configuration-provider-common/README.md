# @summerfi/configuration-provider-common

Shared interface layer for the Summer.fi configuration system. The package exports
`IConfigurationProvider`, `ConfigItem`, and `ConfigKey` — the three types that define how
configuration values (typically sourced from environment variables) are looked up across the
monorepo. It has no runtime logic of its own; concrete implementations live in
`configuration-provider` and `configuration-provider-mock`.

## Key exports

| Export                   | Kind       | Description                                                                                                       |
| ------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| `IConfigurationProvider` | interface  | Single method `getConfigurationItem({ name: ConfigKey }): ConfigItem`; throws when the item is missing or invalid |
| `ConfigKey`              | type alias | `string` — the name used to look up a configuration value                                                         |
| `ConfigItem`             | type alias | `string` — the resolved configuration value                                                                       |

All three are re-exported from the package root (`src/index.ts`).

## Commands

```bash
pnpm build    # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm test     # jest --passWithNoTests
pnpm testw    # jest --watch
pnpm lint     # eslint .
pnpm lint:fix # eslint . --fix
```

## Cross-package connections

**Consumes:** nothing at runtime — this is an interface-only leaf (`IConfigurationProvider`,
`ConfigKey`, `ConfigItem`, all string-based, no `@summerfi/*` imports). `@summerfi/sdk-common` is
declared in `package.json` but never imported.

**Consumed by:** all `-service` packages (abi-provider-service, address-book-service,
allowance-manager-service, armada-protocol-service, contracts-provider-service, oracle-service,
order-planner-service, subgraph-manager-service, swap-service, tokens-service),
`blockchain-client-provider`, `configuration-provider`, `configuration-provider-mock`, `sdk-server`,
`sdk-server-common`, `tenderly-utils`, `testing-utils`

**Layering:** this package sits in the _common_ layer (types/interfaces only); service packages
depend on it to accept `IConfigurationProvider` without depending on any concrete implementation.

**Gotchas:**

- The package has no build output committed — run `pnpm build` before any downstream package that
  imports from `dist/`.
- The `exports` field in `package.json` points to `./src/index.ts` for the `import` condition, so
  workspace consumers resolve directly to source during development; the `dist/` path is used only
  in published/deployed builds.

Full SDK reference docs live in `gitbook/reference`.
