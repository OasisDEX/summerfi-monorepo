# @summerfi/sdk-speed-test

Manual performance probe for the SDK API. Runs five `sdk-client` calls three times each
(`getUserPositions`, `getVaultRaw`, `getMigratablePositions`, `getSummerToken`,
`getAggregatedRewards`) and prints per-call durations and mean times.

**Not part of the build graph** — no `build`, `lint`, or `test` scripts. Invoke directly:

```
pnpm speed-test <chainId> <walletAddress> <fleetAddress>
```

Requires `bun` installed globally and `SDK_API_URL` set (loaded from `../../.env` /
`../../.env.local` via `dotenvx`).

**Dependencies:** `@summerfi/sdk-client`, `@summerfi/sdk-common`. Nothing in the monorepo depends on
this package.

## Cross-package connections

**Consumes:** `@summerfi/sdk-client` (`makeSDK` in `src/index.ts`), `@summerfi/sdk-common` (chain/type
imports). `@summerfi/eslint-config`, `@summerfi/jest-config`, `@summerfi/typescript-config` are
declared devDeps but this package has no `build`/`lint`/`test` scripts, so they are effectively
unused build tooling.

**Consumed by:** nothing in the monorepo — leaf dev/benchmark harness (no `build`/`lint`/`test`, not
in the Turbo build graph, not in the `cicheck` filter).

**Gotchas:**

- Runs against a **live** SDK backend, not the local workspace source: `src/index.ts` builds the
  client with `apiURL: ${process.env.SDK_API_URL}/sdk/trpc` and throws `SDK_API_URL is not set` if
  the env var is missing. `SDK_API_URL` is loaded from `../../.env` / `../../.env.local` via
  `dotenvx`, not from `turbo.json` (this package is invoked directly, not through Turbo).
- Executed with `bun` (`bun run src/index.ts`), not `tsc`/`node` — `bun` must be installed globally.
- Positional args are `<chainId> <walletAddress> <fleetAddress>`; the probed calls
  (`getUserPositions`, `getVaultRaw`, `getMigratablePositions`, `getSummerToken`,
  `getAggregatedRewards`) mirror the `sdk-client` manager surface, so a rename there breaks this
  harness silently at runtime (no CI catches it).
