# @summerfi/portfolio-overview-function

AWS Lambda handler (`GET /api/portfolio/overview`) that accepts a wallet `address` query parameter,
fetches the address's DeFi protocol positions from the DeBank API across supported chains, and
returns a `PortfolioOverviewResponse` containing supplied USD value, borrowed USD value, net
Summer.fi USD value, and total cross-protocol asset value. Positions are filtered to
Summer.fi-supported protocol and proxy IDs before aggregation.

## Key exports / entry points

| Export                                   | Description                                                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `handler` (default + named)              | `APIGatewayProxyEventV2` handler — the SST stack wires this as `src/index.handler`                                     |
| `getSupportedPositions` (`src/utils.ts`) | Filters `DebankComplexProtocol[]` to entries matching `DEBANK_SUPPORTED_PROTOCOL_IDS` and `DEBANK_SUPPORTED_PROXY_IDS` |

## Build / test / dev commands

```bash
# Single-file esbuild bundle (dist/index.js + sourcemap)
pnpm build

# Run Jest (passes with no tests)
pnpm test
pnpm testw          # watch mode

# Lint
pnpm lint
pnpm lint:fix
```

## Cross-package connections

**Consumes**

- `@summerfi/serverless-shared` — response helpers (`ResponseOk`, `ResponseBadRequest`,
  `ResponseInternalServerError`), Zod validators (`addressSchema`), DeBank types
  (`DebankSimpleProtocol`, `DebankComplexProtocol`, `DebankPortfolioItemObject`), constants
  (`DEBANK_SUPPORTED_CHAIN_IDS`, `DEBANK_SUPPORTED_PROTOCOL_IDS`, `DEBANK_SUPPORTED_PROXY_IDS`), and
  the `PortfolioOverviewResponse` domain type.

**Consumed by**

- `stacks/portfolio.ts` (SST stack) — registers this function as the `GET /api/portfolio/overview`
  API route.

**Required environment variables**

Both must be present at deploy time (validated in `stacks/portfolio.ts`) and at runtime (read from
`event.stageVariables` with `process.env` fallback):

| Variable         | Purpose                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `DEBANK_API_KEY` | Bearer key sent as `Accesskey` header to the DeBank proxy                                                                |
| `DEBANK_API_URL` | Base URL of the DeBank proxy (`/v1/user/all_simple_protocol_list` and `/v1/user/all_complex_protocol_list` are appended) |

**Gotchas**

- The bundle target is `node20` single-file; there is no TypeScript `composite` / `tsc` build —
  running `tsc` alone does not produce deployable output.
- `DEBANK_SUPPORTED_PROTOCOL_IDS` and `DEBANK_SUPPORTED_PROXY_IDS` are hand-maintained lists in
  `@summerfi/serverless-shared`; adding a new Summer.fi integration requires updating those
  constants there, not in this package.
- `suppliedPercentageChange`, `borrowedPercentageChange`, and `summerPercentageChange` are hardcoded
  to `0` in the current response — percentage-change tracking is not yet implemented.
