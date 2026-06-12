# @summerfi/sdk-server

The tRPC backend for the Summer.fi SDK. `SDKAppRouter.ts` composes all procedure handlers into
top-level namespaces (`debug`, `protocols`, `tokens`, `simulation`, `orders`, `intentSwaps`,
`allowance`, `swaps`, `oracle`, `armada.{users,admin,accessControl,dca}`, `rwa`). `SDKTRPC.ts`
initialises tRPC with `SerializationService` as the transformer and a timing/logging middleware
gated on `SDK_LOGGING_ENABLED`. The per-request context (`context/SDKContext.ts`) instantiates every
manager and service the handlers consume; see "Cross-package connections" below for the full list.

## Key exports

| Export                 | Description                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------- |
| `sdkAppRouter`         | The composed tRPC router (all namespaces).                                             |
| `SDKAppRouter` (type)  | Exported type consumed by `@summerfi/sdk-client` for end-to-end type safety.           |
| `createSDKContext`     | Factory called once per request; builds `SDKAppContext` from the raw AWS Lambda event. |
| `SDKAppContext` (type) | Shape of the tRPC context: holds every manager/provider available to handlers.         |

Handler files live under `src/handlers/` (general) and `src/armada-protocol-handlers/`
(armada/rwa/dca/access-control). SDK reference docs live in `gitbook/reference`.

## Commands

```bash
pnpm build      # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm watch      # tsc -w
pnpm test       # jest tests/ --passWithNoTests
pnpm e2e        # jest e2e/
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

## Cross-package connections

**Consumes:** nearly all `*-common` and `*-service` SDK packages —
`@summerfi/abi-provider-{common,service}`, `address-book-{common,service}`,
`allowance-manager-{common,service}`, `armada-protocol-{common,service}`,
`blockchain-client-{common,provider}`, `configuration-provider{,-common}`,
`contracts-provider-{common,service}`, `oracle-{common,service}`, `order-planner-{common,service}`,
`protocol-manager-{common,service}`, `protocol-plugins{,-common}`, `simulator-service`,
`subgraph-manager-service`, `swap-{common,service}`, `tokens-{common,service}`, `sdk-common`,
`sdk-server-common`, `core-contracts`, `deployment-utils`, plus `@trpc/server` and
`@cowprotocol/cow-sdk`.

**Consumed by:**

- `@summerfi/sdk-router-function` — AWS Lambda adapter; passes events into `createSDKContext` and
  the router.
- `@summerfi/sdk-client` — imports the `SDKAppRouter` type only, for end-to-end tRPC types.

**Gotchas:**

- `createSDKContext` is called on every request; this includes subgraph fetches and, for
  institutional clients, a `fetchInstiDeploymentProviderConfig` network call. Failures throw and
  abort the request.
- The `Client-Id` request header switches the context to institutional deployment configs. When
  present, `Insti-Version: v2` sources wiring from the RWA/institutions-v2 subgraph and
  `SUMMER_DEPLOYED_CHAINS_ID_RWA` chains; the default when `Client-Id` is present without the header
  is `v1` (legacy institutions subgraph + `SUMMER_DEPLOYED_CHAINS_ID_INSTI` chains).
- `RWAManager` is wired for all requests, but its subgraph manager only carries institutional data;
  RWA routes are unreachable for public (no `Client-Id`) requests.
- `SUMMER_DEPLOYMENT_CONFIG` is passed to `setTestDeployment` at context creation time.
- DCA cookie auth reads `EARN_PROTOCOL_JWT_SECRET` and `EARN_PROTOCOL_DCA_COOKIE_PREFIX` from
  `ConfigurationProvider` to build the per-request `EarnAppCookieVerifier`.
- Adding a new SDK service requires two changes in this package: wire the manager into
  `SDKAppContext` inside `createSDKContext`, then mount its handler(s) in `sdkAppRouter`.
