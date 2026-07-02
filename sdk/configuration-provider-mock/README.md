# @summerfi/configuration-provider-mock

In-memory mock of `ConfigurationProvider` for use in tests. Extends the real provider so fallback
behavior is preserved; individual entries are seeded via `setConfigurationItem` and retrieved via
`getConfigurationItem`, falling back to the base class when a key is not found.

**Exports:** `ConfigurationProviderMock`

**Used by:** `@summerfi/sdk-server-common`, `@summerfi/subgraph-manager-service` (runtime
dependencies)

**Depends on:** `@summerfi/configuration-provider`, `@summerfi/configuration-provider-common`
