# @summerfi/abstractions

Shared TypeScript interface definitions used across the monorepo. The package
(`@summerfi/abstractions`) exports two lightweight contracts — `DistributedCache` and `Logger` —
that decouple consumers from any specific implementation. No runtime dependencies; pure type
declarations compiled to `dist/`.

## Key exports

| Export             | Description                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `DistributedCache` | Interface with `get(key): Promise<string \| null>` and `set(key, value): Promise<void>`                                                        |
| `Logger`           | Interface with `critical`, `debug`, `error`, `info`, `warn` methods accepting a string or `LogAttributesWithMessage` plus optional extra input |

Both are re-exported from `src/index.ts` and available at `dist/index.js` / `dist/index.d.ts`.

## Commands

```bash
pnpm build      # tsc -b --preserveWatchOutput -v (compile to dist/)
pnpm dev        # tsc -b --preserveWatchOutput -w
pnpm test       # jest --passWithNoTests
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

`prebuild` runs the same `tsc -b --preserveWatchOutput -v` step automatically before `build`.

## Cross-package connections

**Consumes:** nothing (no runtime or workspace dependencies).

**Consumed by** (workspace dependents):

- `@summerfi/redis-cache` — implements `DistributedCache`
- `@summerfi/defi-llama-client`
- `@summerfi/summer-protocol-db`
- `@summerfi/summer-beach-club-db`
- `@summerfi/borrow-db`
- `@summerfi/summer-protocol-institutions-db`
- `@summerfi/summer-events-subgraph`

**Gotchas:**

- There is no codegen step; the interfaces are hand-written.
- Any package implementing `DistributedCache` or `Logger` must satisfy these interfaces exactly —
  changing a method signature here is a breaking change for all consumers listed above.
- No env vars are required.
