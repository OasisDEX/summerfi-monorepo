[![codecov](https://codecov.io/gh/OasisDEX/summerfi-monorepo/graph/badge.svg?token=QL882Y3C8G)](https://codecov.io/gh/OasisDEX/summerfi-monorepo)

# Summer.fi Monorepo

pnpm + Turborepo monorepo containing the Summer.fi frontend apps (Earn / Lazy Summer protocol), the
TypeScript SDK and its tRPC backend, serverless API functions (SST/AWS Lambda), background jobs,
subgraph and database client packages, and the legacy "operations" smart-contract tooling.

## Setup

Requirements (from root `package.json`): Node `>=20`, `pnpm@8.15.9` (pinned via `packageManager`).

```shell
pnpm i
```

## Common commands

All tasks run through Turborepo (see root `package.json` for the full list):

```shell
pnpm dev                  # run all dev tasks
pnpm dev-earn-app         # earn-protocol app only (also: dev-earn-landing, dev-earn-institutions)
pnpm prebuild             # turbo run prebuild
pnpm build                # turbo run build
pnpm build:sdk            # build only ./sdk/* (also: prebuild:sdk, test:sdk, lint:sdk)
pnpm lint / pnpm lint:fix
pnpm test                 # unit tests; pnpm test:integration for integration tests
pnpm format / pnpm format:fix
pnpm cicheck              # CI check for packages/, external-api/, summerfi-api/ + coverage
pnpm sst:dev              # local SST dev for the summerfi-stack app
pnpm sst:deploy:staging / pnpm sst:deploy:prod
pnpm docs:gen             # regenerate gitbook/ SDK reference (typedoc); pnpm docs:check in CI
```

## Directory overview

| Directory          | What it is                                                                                                                                                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/`            | Next.js frontends: `earn-protocol` (main earn app), `earn-protocol-institutions` (institutional app), `earn-protocol-landing-page`.                                                                                                                                                                                             |
| `sdk/`             | The Summer.fi SDK: `sdk-common` (types), `sdk-client` / `sdk-client-react` (consumer clients), `sdk-server` (tRPC backend), plus `<domain>-common` / `<domain>-service` package pairs (tokens, swap, oracle, armada-protocol, ...) and `protocol-plugins`. Has its own SST config (`sdk/sst.config.ts`).                        |
| `packages/`        | Shared libraries: frontend `app-*` packages (`app-earn-ui`, `app-types`, `app-utils`, ...), subgraph clients (`summer-earn-protocol-subgraph`, `prices-subgraph`, ...), Postgres clients (`summer-protocol-db`, ...), `serverless-shared`, `core-contracts` (legacy operations Solidity), `eslint-config`, `typescript-config`. |
| `summerfi-api/`    | Lambda functions behind the main API (SST): `setup-trigger-function`, `get-triggers-function`, `get-apy-function`, `get-rates-function`, portfolio functions, etc.                                                                                                                                                              |
| `background-jobs/` | Scheduled (cron) lambdas: beach-club rewards, earn paginated tables, earn rewards APR, tally delegates.                                                                                                                                                                                                                         |
| `external-api/`    | Partner-facing gateway lambdas (gateway.summer.fi): `get-campaign-data-function`, `get-collateral-locked-function`, `get-protocol-info-function`.                                                                                                                                                                               |
| `stacks/`          | SST stack definitions wiring the lambdas, routes, VPC, Redis and crons (`summer-stack.ts`, `partners-stack.ts`, `triggers.ts`, `apy.ts`, ...), used by root `sst.config.ts`.                                                                                                                                                    |
| `armada-protocol/` | Armada (earn protocol v2) contract `abis` package and the `contracts` git submodule (`pnpm armada:install`).                                                                                                                                                                                                                    |
| `turbo/`           | Turborepo code generators (`turbo gen`): SDK service and protocol plugin scaffolding.                                                                                                                                                                                                                                           |
| `gitbook/`         | Published SDK documentation, partially generated — regenerate with `pnpm docs:gen`.                                                                                                                                                                                                                                             |

## Cross-package changes

See [AGENTS.md](./AGENTS.md) for a package map and step-by-step checklists for common cross-package
changes (new SDK service, new chain, new token, new lambda, new trigger type, ...).

## Submodules

To initialize submodules use `git submodule update --init armada-protocol/contracts` (or
`pnpm armada:install`). If a submodule folder is broken, delete it and run
`./bin/restore-git-submodule`.
