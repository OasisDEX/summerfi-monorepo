# @summerfi/configuration-provider

`@summerfi/configuration-provider` is the concrete environment-variable reader for the Summer.fi
SDK. On construction it reads `process.env` for every key listed in the root `turbo.json`
`globalEnv` array (imported directly as `../../../../turbo.json`) and exposes them through the
`IConfigurationProvider` interface defined in `configuration-provider-common`. It is the server-side
counterpart to `configuration-provider-mock`, which is used in tests.

## Key exports

| Export                  | Source                                        |
| ----------------------- | --------------------------------------------- |
| `ConfigurationProvider` | `src/implementation/ConfigurationProvider.ts` |

`ConfigurationProvider` is the only export. It implements `IConfigurationProvider` from
`@summerfi/configuration-provider-common`.

## Commands

```bash
pnpm build    # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm test     # jest --passWithNoTests
pnpm testw    # jest --watch
pnpm lint     # eslint .
pnpm lint:fix # eslint . --fix
```

## Cross-package connections

**Consumes:** `@summerfi/configuration-provider-common` (interfaces `IConfigurationProvider`,
`ConfigKey`, `ConfigItem`) and the root `turbo.json` (the `globalEnv` key list).
(`@summerfi/sdk-common` is listed in package.json dependencies but is not imported by any source
file in this package.)

**Consumed by:** `sdk-server` (in `src/context/`) and, in `e2e/` only, `armada-protocol-service`,
`contracts-provider-service`, `oracle-service`, and `tenderly-utils`. `configuration-provider-mock`
also imports it. (`subgraph-manager-service` and `testing-utils` declare the dependency but do not
import it.) Tests and local mocks use `configuration-provider-mock` instead.

**Gotchas:**

- `getConfigurationItem` throws if the requested key is absent. The error message explicitly
  instructs adding the variable to both `sst-environment` and `turbo.json globalEnv`.
- An env var set in the shell but absent from `turbo.json globalEnv` is never loaded by
  `ConfigurationProvider`, even if `process.env` contains it.

SDK reference docs live in `gitbook/reference`. The common/service layering is:
`configuration-provider-common` holds the interfaces; this package holds the production
implementation; `configuration-provider-mock` holds the test stub.
