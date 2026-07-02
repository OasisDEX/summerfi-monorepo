# @summerfi/configuration-provider-mock

In-memory mock of `ConfigurationProvider` for use in tests. Extends the real provider so fallback
behavior is preserved; individual entries are seeded via `setConfigurationItem` and retrieved via
`getConfigurationItem`, falling back to the base class when a key is not found.

**Exports:** `ConfigurationProviderMock`

**Used by:** `@summerfi/sdk-server-common`, `@summerfi/subgraph-manager-service` (runtime
dependencies)

**Depends on:** `@summerfi/configuration-provider`, `@summerfi/configuration-provider-common`

## Cross-package connections

**Consumes:** `@summerfi/configuration-provider` (extends its `ConfigurationProvider` class, so the
mock inherits the real env-backed fallback in `getConfigurationItem`), `@summerfi/configuration-provider-common`
(the `ConfigItem` / `ConfigKey` types).

Build tooling only: `@summerfi/eslint-config`, `@summerfi/jest-config`, `@summerfi/typescript-config`.

**Consumed by:** `sdk-server-common` and `subgraph-manager-service` — but only from test code
(`sdk-server-common/tests/ManagerProviderBase.spec.ts`, `subgraph-manager-service/e2e/subgraph-manager.test.ts`),
never from `src`. This is a testing-only leaf package.

**Gotchas:**

- Because `ConfigurationProviderMock extends ConfigurationProvider`, a key that is not seeded via
  `setConfigurationItem` falls through to `super.getConfigurationItem`, which reads the real env and
  throws `Missing env variable: <name>...` if the key is not in `turbo.json` `globalEnv`. Seed every
  key a test relies on, or expect the base-class env behavior.
- Both consumers declare this package under `dependencies` (not `devDependencies`) in their
  `package.json`, even though it is imported only from test files — arguably misclassified, but
  harmless since it ships no runtime side effects.
