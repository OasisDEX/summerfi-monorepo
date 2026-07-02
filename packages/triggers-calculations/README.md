# @summerfi/triggers-calculations

Position and simulation math shared across the trigger setup and read paths. The package provides
on-chain position fetching (via `viem` multicall), current stop-loss decoding, LTV/collateral
arithmetic helpers, and an auto-take-profit simulation — all reusable primitives consumed by the
Lambda functions that create and query automation triggers.

## Key exports

| Export                                                                                 | Source file                               | What it does                                                                            |
| -------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------- |
| `getAavePosition`                                                                      | `src/get-aave-position.ts`                | Fetches live Aave v3 position data (collateral, debt, LTV, oracle prices) via multicall |
| `getMorphobluePosition`                                                                | `src/get-morphoblue-position.ts`          | Same for Morpho Blue                                                                    |
| `getSparkPosition`                                                                     | `src/get-spark-position.ts`               | Same for Spark                                                                          |
| `getCurrentAaveStopLoss`                                                               | `src/get-current-aave-stop-loss.ts`       | Decodes an existing Aave stop-loss trigger into `CurrentStopLoss`                       |
| `getCurrentMorphoblueStopLoss`                                                         | `src/get-current-morphoblue-stop-loss.ts` | Same for Morpho Blue                                                                    |
| `getCurrentSparkStopLoss`                                                              | `src/get-current-spark-stop-loss.ts`      | Same for Spark                                                                          |
| `simulateAutoTakeProfit`                                                               | `src/simulations/auto-take-profit/`       | Projects next profit-taking step given current position state                           |
| helpers (`calculateLtv`, `calculateCollateral`, `calculateBalance`, `reversePrice`, …) | `src/helpers/`                            | Pure arithmetic utilities used by position fetchers and stop-loss decoders              |

## Build / test / dev commands

```bash
pnpm build       # tsc -b --preserveWatchOutput -v (compiles to dist/)
pnpm dev         # tsc -b --preserveWatchOutput -w
pnpm test        # jest --passWithNoTests
pnpm lint        # eslint .
pnpm lint:fix    # eslint . --fix
```

## Cross-package connections

**Consumes:**

- `@summerfi/triggers-shared` — `PositionLike`, `CurrentStopLoss`, `TokenBalance`, `PRICE_DECIMALS`;
  `@summerfi/triggers-shared/contracts` — `Trigger`, `getPropertyFromTriggerParams`
- `@summerfi/serverless-shared` — `Address`, `safeParseBigInt`
- `@summerfi/abis` — `aavePoolDataProviderAbi`, `aaveOracleAbi`, `erc20Abi` (and Morpho Blue / Spark
  equivalents)
- `@summerfi/prices-subgraph` — listed as a dependency (used in simulations)
- `viem` — `PublicClient` for all on-chain multicalls
- `@aws-lambda-powertools/logger` — optional `Logger` parameter on all position fetchers

**Consumed by:**

- `summerfi-api/get-triggers-function` — reads current trigger state and position
- `summerfi-api/setup-trigger-function` — computes execution prices/LTVs when registering triggers

**Gotchas:**

- No codegen step — the package is compiled with plain `tsc`; run `pnpm build` in this package (or
  from the repo root via turbo) before dependent Lambdas are bundled.
- Adding a new trigger type means adding the corresponding `get-<protocol>-position.ts` and/or
  `get-current-<protocol>-stop-loss.ts` here, then re-exporting from `src/index.ts`, so both
  consuming Lambdas pick it up automatically.
- Most arithmetic uses native `BigInt`, but `bignumber.js` is actively used in
  `getMorphobluePosition` for intermediate price calculations; be careful not to mix types when
  extending helpers.
