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
