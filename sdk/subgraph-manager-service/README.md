# @summerfi/subgraph-manager-service

Concrete GraphQL subgraph manager implementations for the Summer.fi SDK. The package provides
`SubgraphManagerFactory` with three static factory methods — `newArmadaSubgraph`, `newDcaSubgraph`,
and `newRwaSubgraph` — that construct typed managers whose GraphQL endpoint URLs are resolved at
runtime from the `SDK_SUBGRAPH_CONFIG` environment variable (a JSON map of
`chainId → { protocol, institutions, rwa, dca? }` URLs). This is the _service_ layer; interfaces and
GraphQL client factories live in `@summerfi/subgraph-manager-common`.

## Key exports

| Export                   | Description                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SubgraphManagerFactory` | Entry point; create managers via `newArmadaSubgraph`, `newDcaSubgraph`, `newRwaSubgraph`                                                                                       |
| `ArmadaSubgraphManager`  | Armada protocol/institutions/RWA queries; selects subgraph type by `instiVersion`                                                                                              |
| `DcaSubgraphManager`     | DCA protocol subgraph queries                                                                                                                                                  |
| `RwaSubgraphManager`     | Extends `ArmadaSubgraphManager`; adds `getRwaClient` and RWA-specific query overrides; subgraph type is determined by `instiVersion` (same routing as `ArmadaSubgraphManager`) |

## Scripts

```bash
pnpm build      # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm test       # jest tests/ --coverage=true --passWithNoTests
pnpm e2e        # jest e2e/
pnpm watch      # tsc -w
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

## Cross-package connections

**Consumes:** `@summerfi/subgraph-manager-common` (interfaces + GraphQL client factories),
`@summerfi/configuration-provider-common` (config access), `@summerfi/sdk-common`;
`@summerfi/configuration-provider-mock` (tests only). Note: `@summerfi/configuration-provider` and
`@summerfi/sdk-server-common` are declared in `package.json` but never imported.

**Consumed by:** `sdk-server`, `armada-protocol-service`.

**Gotchas:**

- `SDK_SUBGRAPH_CONFIG` must be a valid JSON string mapping chain IDs to endpoint URLs; any parse
  failure throws at manager construction time.
- Passing `clientId` without `instiVersion` throws at construction time; the reverse (providing
  `instiVersion` without `clientId`) is allowed.
- `ArmadaSubgraphManager` selects its subgraph type at construction: `instiVersion === 'v1'` routes
  to the `institutions` subgraph; `instiVersion === 'v2'` routes to the `rwa` subgraph; no
  `clientId`/`instiVersion` routes to the `protocol` subgraph. `RwaSubgraphManager` follows the same
  routing (it forwards `clientId`/`instiVersion` to the base class at runtime), but adds
  `getRwaClient` and overrides query methods to enforce direct use of the `rwa` subgraph endpoint
  rather than the base class dispatch logic.

SDK reference docs live in `gitbook/reference`.
