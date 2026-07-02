# stacks — cross-package dependencies

SST infrastructure definitions for the `summerfi-stack` app. Two top-level stacks, wired by the
repo-root `sst.config.ts`:

- **`summer-stack.ts` (`API`)** — the main internal API (`new Api(stack, 'api')`). Composes every
  `add<Feature>Config(...)` feature module, creates the shared VPC binding and ElastiCache, and
  `return`s `{ cache, vpc }` for cross-stack reuse.
- **`partners-stack.ts` (`ExternalAPI`)** — the partner gateway (`gateway.summer.fi` /
  `gateway.staging.summer.fi`). Pulls the `API` stack's cache with SST `use(API)`.

This file documents the coupling that causes deploy incidents: the by-path handler references, the
cross-stack `use(API)` ordering, env injection from `../.env`, and the staging/prod-only VPC + Redis.

## What each stack module deploys

Every feature is an `add<Feature>Config(context)` module imported and called inside `API()` (or
`ExternalAPI()`). Handlers are referenced by **source path relative to repo root**, not by npm name —
there is no `package.json` dependency edge, so moving/renaming a lambda source dir silently breaks
the deploy (nothing type-checks the string). Routes are attached with `api.addRoutes(stack, {...})`.

| Module                     | Lambdas (handler source path)                                                                                   | Routes / schedule                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `triggers.ts`              | `summerfi-api/get-triggers-function`, `summerfi-api/setup-trigger-function`                                    | `GET /api/triggers`, `POST /api/triggers/{chainId}/{protocol}/{trigger}`     |
| `migrations.ts`            | `summerfi-api/get-migrations-function`                                                                          | `GET /api/migrations`                                                        |
| `portfolio.ts`             | `summerfi-api/portfolio-assets-function`, `summerfi-api/portfolio-overview-function`                          | `GET /api/portfolio/assets`, `GET /api/portfolio/overview`                   |
| `morpho.ts`                | `summerfi-api/get-meta-morpho-details-function`, `summerfi-api/get-morpho-claims-function`                    | `GET /api/morpho/meta-morpho`, `GET /api/morpho/claims`                      |
| `apy.ts`                   | `summerfi-api/get-apy-function`, `summerfi-api/get-rates-function`, `summerfi-api/get-vault-rates-function`   | `GET /api/apy/...`, `GET/POST /api/rates`, `POST /api/vault/rates` (+more). VPC + cache-wired |
| `spark-rewards-claim.ts`   | `summerfi-api/spark-rewards-claim`                                                                              | `GET /api/spark-rewards-claim`                                               |
| `summer-protocol.ts`       | `background-jobs/update-summer-earn-rewards-apr`, `update-beach-club-rewards-function`, `update-tally-delegates` | Crons (rate 10 min / 1 h / 24 h). VPC-attached                              |
| `summer-earn-app-tables.ts`| `background-jobs/update-summer-earn-paginated-tables` (4 named handlers: `latestActivityHandler`, `topDepositorsHandler`, `rebalanceActivityHandler`, `vaultsBenchmarkHandler`) | Crons (1 min / 5 min / 10 min / daily 02:00 UTC). VPC-attached |
| `partners-stack.ts`        | `external-api/get-collateral-locked-function`, `external-api/get-protocol-info-function`, `external-api/get-campaign-data-function` | Partner gateway routes. VPC + cache-wired                    |

Support modules (not `add<Feature>Config`): `vpc.ts` (`attachVPC`), `redis.ts` (`addRedis`),
`summer-stack-context.ts` (the `SummerStackContext` type: `{ api, cache, vpc, isDev, isProd, isStaging }`).

## Cross-stack dependency & deploy ordering

`ExternalAPI` calls `use(API)` (`partners-stack.ts`) to read `{ cache }` from the `API` stack. This
creates a CloudFormation dependency, so **`API` deploys before `ExternalAPI`**. `sst.config.ts`
registers both (`app.stack(API); app.stack(ExternalAPI)`); the order there does not matter, SST
resolves it from `use()`.

- The ElastiCache is `RETAIN` (`redis.ts`, `applyRemovalPolicy(RETAIN)`) and lives in the `API`
  stack. Because its URL/ARN cross the stack boundary, removing or renaming the cache requires
  updating `ExternalAPI` first (drop the `use(API).cache` read) or the export stays referenced.
- `get-protocol-info` and `get-campaign-data` (partners) plus `get-apy`/`get-rates`/`get-vault-rates`
  (main) all run **in the VPC private subnets** to reach the cache; NAT egress keeps `SUBGRAPH_BASE`
  / `RPC_GATEWAY` reachable. See `external-api/get-protocol-info-function/CLAUDE.md` for the
  handler-side cache/VPC contract.

## VPC & Redis are staging/prod-only

`attachVPC` (`vpc.ts`) returns `null` on `dev-*` stages; `addRedis` (`redis.ts`) returns `null`
whenever `vpc` is null. So `cache` and `vpc` are `null` on dev stages and every module guards with
`...(vpc && { vpc: ..., vpcSubnets: ..., securityGroups: ... })` / `if (cache) { ... }`. Consequences:

- Dev stages: functions run outside a VPC, no managed Redis — handlers fall back to a noop cache (and
  the DBs must be reachable over the public internet, which is why dev uses local docker-compose).
- `attachVPC` **throws** if `VPC_ID` / `SECURITY_GROUP_ID` are unset on a non-dev stage.
- `apy.ts` has a legacy fallback path: when there is no managed `cache` it passes through external
  `REDIS_CACHE_URL` / `REDIS_CACHE_PASSWORD` / `REDIS_CACHE_USER` env instead.

## Environment variables

Env is loaded by `sst.config.ts` from **`../.env`** via `dotenv` (`path: ['../.env']`) — **not** from
`turbo.json` `globalEnv` (that governs the SDK's `ConfigurationProvider`, a different mechanism). Each
module validates its required vars with an explicit `throw` at synth time, so a missing var fails the
deploy fast rather than at runtime.

| Var                                        | Read by                                                     | Notes                                            |
| ------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------ |
| `AWS_REGION`, `AWS_PROFILE`, `SST_USER`    | `sst.config.ts`                                             | `SST_USER` derives the `dev-<user>` stage        |
| `SUBGRAPH_BASE`                            | triggers, apy, spark-rewards, summer-protocol, partners    | `${SUBGRAPH_BASE}/<subgraph-name>`               |
| `RPC_GATEWAY`                              | triggers, migrations, morpho, apy, spark-rewards, partners |                                                  |
| `EARN_PROTOCOL_DB_CONNECTION_STRING`       | apy, summer-protocol, partners                             |                                                  |
| `BEACH_CLUB_REWARDS_DB_CONNECTION_STRING`  | summer-protocol                                            |                                                  |
| `TALLY_API_KEY`                            | summer-protocol (`update-tally-delegates`)                 |                                                  |
| `DEBANK_API_URL`, `DEBANK_API_KEY`, `FUNCTIONS_API_URL` | portfolio                                     |                                                  |
| `EARN_PROTOCOL_UPDATE_TABLES_AUTH_TOKEN`, `EARN_APP_URL` | summer-earn-app-tables                        |                                                  |
| `VPC_ID`, `SECURITY_GROUP_ID`              | `vpc.ts`                                                    | required non-dev; else `attachVPC` throws        |
| `REDIS_CACHE_URL` / `_PASSWORD` / `_USER`  | `apy.ts` fallback only                                      | superseded by managed ElastiCache when present   |
| `SKIP_VALIDATION`                          | injected into `setup-trigger-function`                     | defaults `'false'`                               |
| `POWERTOOLS_LOG_LEVEL`                     | all lambdas                                                | defaults `'INFO'`                                |

`GET_TRIGGERS_URL` is injected into `setup-trigger-function` at synth time from `api.url`
(`triggers.ts`) — it is not read from `.env`. `STAGE` / `NODE_ENV` are injected from `stack.stage`.

## Deploy guardrails (sst.config.ts)

`config()` enforces, for `staging`/`production`:

- production only from `main` or `dev` branch;
- local branch must be up to date with `origin` (no unfetched commits);
- `pnpm install && pnpm run cicheck` must pass;
- no uncommitted/untracked changes.

Dev stages (`dev-*`) auto-start `stacks/local-env/docker-compose.yaml` (expects exactly 2 services —
`redis-cache`, `oasis-borrow-db`) if Docker is running.

## Adding a new API function / stack module — checklist

Mirrors AGENTS.md "Add a new API function/lambda". In this package specifically:

1. Create the lambda package under `summerfi-api/`, `external-api/`, or `background-jobs/`.
2. Add (or extend) an `add<Feature>Config(context)` module here, `new Function(stack, '<id>', { handler: '<repo-relative-src-path>.handler', runtime: 'nodejs20.x', environment: {...} })`. Validate required env with explicit throws.
3. Register the module: call it inside `API()` (`summer-stack.ts`) for internal routes, or add the `Function` + `apiForPartners.addRoutes` in `ExternalAPI()` (`partners-stack.ts`) for partner routes. Use `new Cron(...)` for scheduled jobs (see `summer-protocol.ts`).
4. If it needs Postgres/ElastiCache, run it in the VPC: spread `...(vpc && { vpc: vpc.vpc, vpcSubnets: { subnets: [...vpc.vpc.privateSubnets] }, securityGroups: [vpc.securityGroup] })`, and for cache `if (cache) { fn.addToRolePolicy(cache.policyStatement); fn.addEnvironment('REDIS_CACHE_URL', cache.url) }`. Remember these are `null` on dev.
5. Add any new env var to `../.env` (all stages) — there is no `turbo.json` edit for stack env.

## Notes

- `@summerfi/stacks` has **no runtime `@summerfi/*` imports** and is not imported by npm name
  anywhere. `sst.config.ts` imports the stack functions by relative path
  (`./stacks/summer-stack`, `./stacks/partners-stack`). devDeps `pg` / `kysely` / `kysely-codegen` /
  `viem` are present but the checked-in stack modules do not import them at synth time.
- The handler-path strings are the only link to the lambda packages. There is no compile-time check
  that they resolve — grep for the path when renaming a lambda directory.
