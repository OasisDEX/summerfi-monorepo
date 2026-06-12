# @summerfi/sdk-router-function

AWS Lambda entrypoint for the Summer.fi SDK API. Wraps `sdkAppRouter` and `createSDKContext` from
`@summerfi/sdk-server` using `@trpc/server`'s `awsLambdaRequestHandler` (`maxBatchSize: 5`,
`allowMethodOverride: true`).

Also exports a separate `handler` from `options.ts` that handles CORS preflight (OPTIONS) requests.

**Consumed by:** SST deployment via `@summerfi/sdk-infra`.

**Gotcha:** All incoming Lambda event headers are lower-cased before the request is handled. This is
required because `SDKContext` reads both `Client-Id` and `client-id` header variants; API Gateway
does not guarantee casing.

## Scripts

| Script   | Description                  |
| -------- | ---------------------------- |
| `deploy` | `sst deploy --stage staging` |
| `remove` | `sst remove --stage staging` |
| `dev`    | `sst dev`                    |
| `test`   | Jest                         |
| `tsc`    | Type-check                   |
