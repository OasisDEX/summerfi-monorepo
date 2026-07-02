# @summerfi/get-triggers-function

AWS Lambda handler (`handler` exported from `src/index.ts`) that retrieves and decodes all active
automation triggers for a given DeFi position. Given a query-string containing `account` (proxy
address), `chainId`, and optionally `poolId`, `protocol`, `rpc`, and `getDetails`, it queries the
automation subgraph for raw trigger records, decodes them into typed structures, and returns a JSON
response covering stop-loss, basic-buy/sell, trailing stop-loss, partial take-profit, and
auto-take-profit triggers across Maker, Aave, Spark, and Morpho Blue protocols.

## Key entry points

| Path                                      | Purpose                                                                                                                                |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `src/index.ts` — `handler`                | Lambda entry point; validates params via `paramsSchema`, calls `getSimpleTriggers` then `getAdvancedTriggers`, maps the final response |
| `src/helpers/get-simple-triggers.ts`      | Synchronous decode of all single-record trigger types (stop-loss, basic buy/sell) across all protocols                                 |
| `src/helpers/get-advanced-triggers.ts`    | Async decode of triggers that require extra RPC or subgraph calls (trailing stop-loss, partial take-profit, Maker auto-take-profit)    |
| `src/trigger-parsers/`                    | Per-protocol parsers for Aave/Spark/Morpho trailing stop-loss and partial take-profit                                                  |
| `src/constants/index.ts` — `paramsSchema` | Zod schema validating `account`, `chainId`, `poolId`, `rpc`, `getDetails`                                                              |

## Build / test / lint commands

```
pnpm build        # tsc -b --preserveWatchOutput -v
pnpm test         # jest --passWithNoTests
pnpm lint         # eslint .
pnpm lint:fix     # eslint . --fix
```

There is no `dev` or `start` script; local execution requires deploying to AWS Lambda or invoking
the handler directly.

## Cross-package connections

**Consumes:**

- `@summerfi/automation-subgraph` — `getAutomationSubgraphClient` / `getTriggers` (raw trigger
  records)
- `@summerfi/prices-subgraph` — `getPricesSubgraphClient` (used by trailing stop-loss parsers)
- `@summerfi/serverless-shared` — response helpers (`ResponseOk`, `ResponseBadRequest`,
  `ResponseInternalServerError`), validators (`addressSchema`, `chainIdSchema`,
  `optionalPoolIdSchema`), `getRpcGatewayEndpoint`, `ChainId`
- `@summerfi/triggers-shared` — typed trigger interfaces, trigger type ID constants, `getAddresses`
- `@summerfi/triggers-calculations` — referenced as a dependency; used inside trigger parsers
- `@summerfi/abis` — ABI references used by trigger parsers that call on-chain reads

**Required environment variables (missing either returns HTTP 500):**

- `SUBGRAPH_BASE` — base URL for both the automation and prices subgraph clients
- `RPC_GATEWAY` — base URL passed to `getRpcGatewayEndpoint` for constructing per-chain RPC URLs;
  callers may override per-request via the `rpc` query parameter

**Known gotchas:**

- The `dpm` query parameter is accepted as a deprecated alias for `account` and is remapped before
  validation.
- Morpho Blue triggers are additionally filtered by `poolId`; omitting `poolId` when querying a
  Morpho position returns no Morpho triggers even if they exist.
- Advanced triggers (trailing stop-loss, partial take-profit) make live RPC calls via `viem`; a
  missing or unreachable `RPC_GATEWAY` will cause those parsers to throw at runtime, not at startup.
- `getDetails=true` gates additional on-chain reads inside the partial take-profit parsers; omit it
  when you only need the basic trigger shape.
