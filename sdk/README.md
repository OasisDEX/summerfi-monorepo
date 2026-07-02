# @summerfi/sdk-infra

The SDK's SST app root and the pnpm sub-workspace parent for every `sdk/*` package. This directory
is **not** a library — it ships no importable code. It does two jobs:

1. **Composition / deploy root.** `sst.config.ts` defines a standalone SST app (`name:
   'versioned-sdk'`, separate from the main `summerfi-stack` app wired in the repo-root
   `sst.config.ts`). It deploys one `sdk-router-function` Lambda per entry in
   `SDK_DEPLOYED_VERSIONS_MAP` behind a single `Api` gateway. `sdk-router-function` is the HTTP
   adapter around `sdk-server`, which composes all the `sdk/*-service` factories into the tRPC
   `sdkAppRouter`. Consumers talk to it through `sdk-client` / `sdk-client-react`.
2. **Env schema owner.** `sst-environment.ts` validates and exports `environmentVariables`, the exact
   env map injected into every deployed SDK Lambda.

See `sdk/docs/` (`ADD_SDK_SERVICE.md`, `ADD_NEW_PLUGIN.md`, `DOCS_PLAYBOOK.md`) for how the child
packages fit together.

## Cross-package connections

**Consumes:** nothing via npm — `package.json` (`@summerfi/sdk-infra`) declares only infra deps
(`sst`, `aws-cdk-lib`, `viem`, `zod`, `@dotenvx/dotenvx`, `zx`). It reaches into child packages by
**path, not import**: `sst.config.ts` reads `./sdk-client/bundle/package.json` (`version`) and
deploys `sdk-router-function/src/index.handler` (→ `@summerfi/sdk-server`).

**Consumed by:** nothing in the monorepo — infra/deploy root. It is a pnpm workspace member only so
its `sst`/`aws-cdk-lib` toolchain resolves; no package imports `@summerfi/sdk-infra`.

**Gotchas:**

- **Deploy gate on the client version.** `sst.config.ts` throws and refuses to deploy unless
  `./sdk-client/bundle/package.json` `version` (currently `2.3.0`) appears in
  `SDK_DEPLOYED_VERSIONS_MAP`. Publishing a new `sdk-client` bundle without adding its version to
  the `SDK_DEPLOYED_VERSIONS_MAP` GitHub-environment var will block the next deploy.
- **Versioned multi-Lambda.** Each map entry deploys `SdkBackendV<x_y_z>` and mounts it at both
  `/sdk/trpc/v<major>/{proxy+}` and the legacy `/api/sdk/v<major>/{proxy+}` (see
  `create-backend.ts`). The route major is derived from the first char of the semver, so two
  versions sharing a major would collide on the same path.
- **Env is a triple source of truth.** A key must exist in **all three** of `sst-environment.ts`
  (zod-validated, injected via `create-backend.ts`), `turbo.json` `globalEnv`, and be read by
  `sdk/configuration-provider/src/implementation/ConfigurationProvider.ts` — which only loads keys
  present in `turbo.json` `globalEnv` and throws
  `Missing env variable: <name>. Please add it to the stack configuration in sst-environment and turbo.json.`
  otherwise. Add a new SDK env var to both files.
- **Separate SST app.** This app deploys independently of the repo-root `summerfi-stack` /
  `partners-stack` app; it consumes their URLs via the `FUNCTIONS_API_URL` / `PARTNERS_API_URL` env
  vars, not via SST `use(...)` cross-stack refs.
- **VPC only on staging/production.** `attachDbVpc` is true only for stages `staging`/`production`;
  those stages require `VPC_ID` + `SECURITY_GROUP_ID` (needed to reach
  `EARN_PROTOCOL_DB_CONNECTION_STRING`). Dev stages get no VPC.

See `CLAUDE.md` for the full deploy-gate / env / versioning coupling.
