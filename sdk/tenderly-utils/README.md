# @summerfi/tenderly-utils

Helpers for creating and managing Tenderly virtual networks (vnets) and legacy forks in tests and
local development.

Exports two classes:

- **`Tenderly`** — creates/forks/deletes vnets via the Tenderly REST API; supports snapshots,
  `evm_revert`, and balance overrides (`tenderly_setErc20Balance`, `tenderly_setBalance`).
- **`TenderlyFork`** — older fork-based counterpart (uses `/vnets` legacy path + `axios`); adds
  `sendTransaction` and `getSimulations` helpers backed by `@summerfi/testing-utils`.

**Used by:** `contracts-provider-service`, `sdk-e2e`.

**Depends on:** `@summerfi/sdk-common`, `@summerfi/testing-utils`.

**Gotcha:** `Tenderly` reads `TENDERLY_USER`, `TENDERLY_PROJECT`, and `TENDERLY_ACCESS_KEY` directly
from `process.env` and throws immediately if any are missing — set these before constructing the
class.
