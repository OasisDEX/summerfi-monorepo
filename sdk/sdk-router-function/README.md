# @summerfi/sdk-router-function

AWS Lambda entrypoint for the Summer.fi SDK API. Wraps `sdkAppRouter` and `createSDKContext` from
`@summerfi/sdk-server` using `@trpc/server`'s `awsLambdaRequestHandler` (`maxBatchSize: 5`,
`allowMethodOverride: true`).

Also exports a separate `handler` from `options.ts` that handles CORS preflight (OPTIONS) requests.

## Cross-package connections

**Consumes:** `@summerfi/sdk-server` (`sdkAppRouter` + `createSDKContext`). Everything else is AWS
runtime glue (`@trpc/server/adapters/aws-lambda`, `@aws-lambda-powertools/*`, `aws-lambda` types).
Build tooling only: `@summerfi/eslint-config`, `@summerfi/jest-config`, `@summerfi/typescript-config`.

**Consumed by:** `@summerfi/sdk-infra` — the SDK's own SST app rooted at `sdk/` (name in
`sdk/package.json`). It is wired NOT by npm import but by handler-path string:
`sdk/create-backend.ts` (`handler: 'sdk-router-function/src/index.handler'` for the tRPC backend and
`.../src/options.handler` for CORS preflight) and `sdk/create-backendv3.ts`
(`'./sdk-router-function/src/index.handler'`). No other package imports this one — it is a
deployment leaf.

**Gotchas:**

- **This package reads no `process.env` itself.** All SDK config env vars
  (`SDK_RPC_GATEWAY`, `SDK_SUBGRAPH_CONFIG`, `SUMMER_DEPLOYED_CHAINS_ID`,
  `EARN_PROTOCOL_DB_CONNECTION_STRING`, the `COINGECKO_*` / `ONE_INCH_*` keys, etc.) are validated
  and injected onto the `Function` as `environment: environmentVariables` in `sdk/create-backend.ts`
  from `sdk/sst-environment.ts`, then read at request time by `createSDKContext` /
  `ConfigurationProvider` inside `@summerfi/sdk-server`. A missing key surfaces as a zod parse
  failure in `sst-environment.ts` at deploy, or a `Missing env variable` throw from the SDK at
  runtime — not here.
- **Handler renames are a string-only contract.** The SST `Function` handler paths in
  `create-backend.ts` / `create-backendv3.ts` are literal strings; renaming `index.ts`/`options.ts`
  or the exported `handler` symbols silently breaks deploy with no type error.
- **Header lower-casing is load-bearing.** `index.ts` lower-cases every incoming Lambda event header
  before delegating to the tRPC handler, because `SDKContext` reads both `Client-Id` and `client-id`
  variants (RWA institution routing) and API Gateway does not guarantee casing. `options.ts`
  bypasses this — it only answers CORS preflight and needs no DB/VPC access.
- **Versioned, side-by-side deploys.** `create-backend.ts` derives `apiVersion` from the semver tag
  and names the function `SdkBackendV<x_y_z>`, mounting routes at both `/sdk/trpc/v<N>/{proxy+}` and
  the legacy `/api/sdk/v<N>/{proxy+}`. Multiple SDK versions run concurrently behind the same
  gateway; the OPTIONS handler is a separate lightweight function.

## Scripts

| Script   | Description                  |
| -------- | ---------------------------- |
| `deploy` | `sst deploy --stage staging` |
| `remove` | `sst remove --stage staging` |
| `dev`    | `sst dev`                    |
| `test`   | Jest                         |
| `tsc`    | Type-check                   |
