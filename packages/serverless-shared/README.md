# @summerfi/serverless-shared

Shared types, enums, Zod validators, and AWS Lambda response helpers used across all Summer.fi
serverless lambda packages. It is the canonical chain and protocol registry for the lambda layer:
every lambda that needs to resolve a chain name, build an RPC URL, or validate an address imports
from here rather than defining its own copies.

## Key exports

- **`domain-types.ts`** — `ChainId`, `Network`, `NetworkNames`, `NetworkByChainID`,
  `ChainIDByNetwork`, `ProtocolId`, portfolio response shapes (`PortfolioOverviewResponse`,
  `PortfolioAssetsResponse`, `PortfolioMigrationsResponse`).
- **`getRpcGatewayEndpoint`** — builds the RPC gateway URL as
  `${rpcGatewayUrl}/?network=<Network>&skipCache=…&skipMulticall=…&skipGraph=…&source=…` using
  `NetworkByChainID` to map chain IDs to network names.
- **`responses.ts`** — `ResponseOk`, `ResponseBadRequest`, `ResponseNotFound`,
  `ResponseInternalServerError`, `ResponseForbidden` — typed wrappers around
  `APIGatewayProxyResultV2`.
- **`validators.ts`** — Zod schemas: `addressSchema`, `chainIdSchema`, `chainIdsSchema`,
  `protocolIdsSchema`, `bigIntSchema`, `ltvSchema`, `percentageSchema`.
- **`constants.ts`** — `SUPPORTED_CHAIN_IDS`, `SUPPORTED_PROTOCOL_IDS`, `USD_DECIMALS`.

## Commands

| Purpose          | Script          |
| ---------------- | --------------- |
| Build (one-shot) | `pnpm build`    |
| Build (watch)    | `pnpm dev`      |
| Type-check only  | `pnpm tsc`      |
| Test             | `pnpm test`     |
| Lint             | `pnpm lint`     |
| Lint + fix       | `pnpm lint:fix` |

## Cross-package connections

**Consumed by**: the whole lambda layer — most `summerfi-api/*` and `external-api/*` functions
(get-apy, get-rates, get-triggers, setup-trigger, get-migrations, get-morpho-claims,
get-meta-morpho-details, portfolio-*, spark-rewards-claim, get-protocol-info, get-campaign-data,
get-collateral-locked, …), `background-jobs/update-summer-earn-rewards-apr`, plus `apps/earn-protocol`
and `apps/earn-protocol-institutions`. Among workspace library packages:
`@summerfi/triggers-shared`, `@summerfi/triggers-calculations`, `@summerfi/app-types`,
`@summerfi/app-tos`, `@summerfi/morpho-blue-external-api-client`, `@summerfi/summer-protocol-db`,
`@summerfi/summer-institutions-db`, and several subgraph packages (`aave-spark-subgraph`,
`ajna-subgraph`, `automation-subgraph`, `morpho-blue-subgraph`, `prices-subgraph`,
`summer-earn-protocol-subgraph`, `summer-earn-rates-subgraph`, `summer-earn-institutions-subgraph`,
`summer-events-subgraph`).

**Consumes**: no other monorepo packages (only `viem` and `zod` as runtime dependencies).

**Adding a new chain**: add the chain to `ChainId`, `Network`, `NetworkByChainID`, and
`ChainIDByNetwork` in `src/domain-types.ts`, and to `SUPPORTED_CHAIN_IDS` in `src/constants.ts` if
it should be query-validated. The `Network` enum value is used verbatim as the `?network=` query
parameter in `getRpcGatewayEndpoint`, so the RPC gateway service must recognise exactly that string
before you add it here.

**No env vars, no codegen**: this package is pure TypeScript compiled with `tsc`; there are no
environment variables, code-generation steps, or external service calls at build time.
