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

## Cross-package connections

**Consumes:** `@summerfi/sdk-common` (types), `@summerfi/testing-utils` (backs `TenderlyFork.sendTransaction` / `getSimulations`). Runtime also uses `axios` + `ethers`/`@ethersproject/providers` (declared as devDeps but imported in `src/TenderlyFork.ts`) and `@inquirer/prompts`.

**Consumed by:** `contracts-provider-service` (imported in its `e2e/*.spec.ts`), `sdk-e2e` (declared dep + `tsconfig.test.json` reference; no live `.ts` source import at present). Test/e2e tooling only — not part of any runtime request path.

**Gotchas:**

- Declared deps `@summerfi/configuration-provider` and `@summerfi/configuration-provider-common` are **stale** — nothing under `src/` imports them. `Tenderly.ts` bypasses `ConfigurationProvider` and reads `process.env` directly.
- `TENDERLY_USER` / `TENDERLY_PROJECT` / `TENDERLY_ACCESS_KEY` are registered in `turbo.json` `globalEnv` (lines ~92-94). If you rename or add a Tenderly env var, add it there too or turbo will not expose it to the e2e runs that construct `Tenderly`.
- `axios` and `ethers` are imported by `TenderlyFork.ts` but live in `devDependencies`, not `dependencies` — fine while this package is test-only, but promote them if it ever ships to a runtime consumer.
