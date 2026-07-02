# setup-trigger

npm package name: `setup-trigger`

AWS Lambda handler that validates, encodes, and simulates DeFi automation triggers (stop-loss,
auto-buy, auto-sell, trailing stop-loss, partial take-profit) for Aave, Spark, and Morpho Blue
positions across multiple EVM chains. On each request it: parses and validates path params
(`chainId`, `protocol`, `trigger`) and the JSON body against Zod schemas; builds a protocol-specific
service container (validator + transaction encoder + position simulator); runs validation (skippable
via `x-summer-skip-validation: 1` header); encodes the on-chain trigger transaction; and returns the
encoded trigger data, transaction calldata, position simulation, and any warnings.

## Key entry points

- `src/index.ts` — `handler`: the Lambda entry point (`APIGatewayProxyEventV2` →
  `APIGatewayProxyResultV2`).
- `src/services/index.ts` — `buildServiceContainer`: dispatches to the correct per-protocol service
  container based on trigger type.
- `src/types/` — Zod schemas and inferred TypeScript types for all `SetupTriggerEventBody` variants
  and `ValidationResults`.

## Commands

```
pnpm build      # tsc -b --preserveWatchOutput -v
pnpm watch      # tsc -w
pnpm test       # jest --passWithNoTests
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
pnpm tsc        # tsc (type-check only)
```

## Cross-package connections

**Consumes:**

- `@summerfi/serverless-shared` — `ResponseOk` / `ResponseBadRequest` /
  `ResponseInternalServerError`, domain types (`ChainId`, `ProtocolId`, `Address`),
  `getRpcGatewayEndpoint`, `IRpcConfig`.
- `@summerfi/triggers-shared` — `getAddresses` (chain contract addresses), `GetTriggersResponse`
  type.
- `@summerfi/triggers-calculations` — position simulation and trigger encoding logic (used inside
  per-protocol service containers).
- `@summerfi/prices-subgraph` — `getPricesSubgraphClient` for latest token prices (used by trailing
  stop-loss and partial take-profit containers).
- `@summerfi/abis` — ABI definitions referenced by service containers.
- `@oasisdex/automation` — `TriggerType` enum used to discriminate trigger variants.
- `@oasisdex/dma-library` — DMA library used within service containers.

**Required environment variables (must be set on the Lambda):**

- `RPC_GATEWAY` — base URL for the RPC gateway; the handler aborts with 500 if absent.
- `GET_TRIGGERS_URL` — URL of the get-triggers endpoint polled to fetch existing triggers per
  address; the handler aborts with 500 if absent.
- `SUBGRAPH_BASE` — base URL for the prices subgraph; the handler aborts with 500 if absent.

**Known consumers:** no other workspace package imports this package directly — it is deployed as a
standalone Lambda.

**Gotcha:** adding support for a new trigger type requires changes in at least four places: a new
Zod schema in `src/types/validators/`, a new type export in `src/types/types.ts`, a new type-guard
function and branch in `src/services/index.ts`, and a new service-container file under
`src/services/`.
