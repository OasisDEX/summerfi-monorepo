# @summerfi/sdk-e2e

End-to-end test suite for the Summer.fi SDK that exercises a deployed or forked SDK API across all
major feature areas: Armada Protocol vault operations (deposit, withdraw, switch, cross-chain,
migrations, rewards), governance V2 staking, intent-swaps, DCA strategies, RWA vault lifecycle,
Merkl rewards, access-control roles, admin operations, price oracles, and swap quotes. Tests run
against real forks or subgraphs and are not mocked.

## Key entry points

- `e2e/` — 84 targeted Jest test files, one feature per file (e.g. `armadaProtocol.deposit.test.ts`,
  `rwa.getDepositTx.test.ts`, `govV2.stake.test.ts`)
- `e2e/utils/createTestSdkInstance.ts` — factory that calls `makeSDK` / `makeAdminSDK` /
  `makeInstiSdk` from `@summerfi/sdk-client`, wired to `E2E_SDK_API_URL`
- `e2e/utils/testConfig.ts` — validates required env vars at startup and exports `RpcUrls` map

## Commands

| Script                        | What it runs                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `pnpm test`                   | `jest` (all tests)                                                            |
| `pnpm testw`                  | `jest --watch`                                                                |
| `pnpm e2e`                    | `jest --roots e2e` (all e2e tests)                                            |
| `pnpm e2e:<name>`             | single targeted test (e.g. `e2e:deposit`, `e2e:rwa:vault`, `e2e:govV2.stake`) |
| `pnpm lint` / `pnpm lint:fix` | ESLint                                                                        |

There is no `build` script; this is a test-only leaf package.

## Cross-package connections

**Consumes:** `@summerfi/sdk-client` (SDK factory functions), `@summerfi/sdk-common` (types/chain
ids), `@summerfi/protocol-plugins`, `@summerfi/armada-protocol-abis`, `@summerfi/core-contracts`,
`@summerfi/deployment-utils`, `@summerfi/testing-utils`.

**Consumed by:** nothing — this is a test leaf with no dependents.

**Required env vars** (all validated at startup; missing any causes an immediate throw):

- `E2E_SDK_API_URL` — URL of the deployed or local SDK API
- `E2E_SDK_FORK_URL_MAINNET`, `E2E_SDK_FORK_URL_BASE`, `E2E_SDK_FORK_URL_ARBITRUM`,
  `E2E_SDK_FORK_URL_SONIC`, `E2E_SDK_FORK_URL_HYPERLIQUID` — per-chain fork RPC endpoints
- `E2E_USER_ADDRESS`, `E2E_USER_PRIVATE_KEY`, `TEST_USER_ADDRESS`, `TEST_USER_PRIVATE_KEY` — wallet
  credentials for transaction signing in fork tests
- `SDK_LOGGING_ENABLED` (optional) — set to `"true"` to enable SDK request logging

SDK reference docs live in `gitbook/reference`.
