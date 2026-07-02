# @summerfi/portfolio-assets-function

AWS Lambda handler (`GET /api/portfolio/assets`) that fetches a wallet's token holdings from the
DeBank API, normalises them into the shared `PortfolioAssetsResponse` shape (filtering to
wallet-held tokens with a non-zero price and a recognised Summer.fi network), and returns them
sorted by USD balance descending with a total USD value sum.

## Key entry point

| Export                                                | Location                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------- |
| `handler` (named export; also re-exported as default) | `src/index.ts` — `APIGatewayProxyEventV2 → APIGatewayProxyResultV2` |

The bundle entrypoint is `src/index.ts`; esbuild produces a single minified `dist/index.js` for
deployment.

## Build / test commands

```bash
pnpm build   # esbuild bundle → dist/index.js (Node 20, minified + sourcemap)
pnpm test    # jest --passWithNoTests
pnpm lint    # eslint .
pnpm lint:fix
```

## Cross-package connections

**Consumes:**

- `@summerfi/serverless-shared` — `ResponseOk`, `ResponseBadRequest`, `getDefaultErrorMessage`,
  `DebankToken`, `DebankNetworkNameToOurs`, `DebankNetworkNames`, `NetworkNames`,
  `PortfolioWalletAsset`, `PortfolioAssetsResponse`, `addressSchema`

**Consumed by:**

- `stacks/portfolio.ts` — registers this handler as `get-portfolio-assets-function` (SST `Function`,
  `nodejs20.x`) and mounts it on `GET /api/portfolio/assets`

**Required environment variables** (injected via SST stage variables or `process.env`):

- `DEBANK_API_KEY` — DeBank access key sent as the `Accesskey` header
- `DEBANK_API_URL` — DeBank base URL (e.g. `https://pro-openapi.debank.com`)
- `FUNCTIONS_API_URL` — base URL of the deployed functions API (validated at startup but not used in
  the request path of this function)

**Gotchas:**

- The `build` script does not run automatically before deployment; `dist/index.js` must be present
  or SST must be configured to build it.
- `FUNCTIONS_API_URL` is required at cold-start even though this function does not call it; missing
  it throws before any request is handled.
