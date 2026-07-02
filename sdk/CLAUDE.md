# sdk-infra — cross-package dependencies

`sdk/` (npm name `@summerfi/sdk-infra`) is the **SDK's standalone SST app root** and the pnpm
sub-workspace parent for every `sdk/*` package. It ships no importable library code — its job is to
**deploy** the SDK backend and to **own the env schema** injected into it. The deployed artifact is
`sdk-router-function` (the HTTP/Lambda adapter around `@summerfi/sdk-server`), served over one `Api`
gateway, deployed once per version.

This file documents the deploy-time coupling that causes incidents: the **client-version deploy
gate**, the **versioned multi-Lambda routing**, and the **env triple source of truth**.

## Data sources & what each provides

| Source (path, not npm import)                | Provides                                                                                      | Read by                              |
| -------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------ |
| `./sdk-client/bundle/package.json` `version` | The published `sdk-client` semver; deploy gate compares it against `SDK_DEPLOYED_VERSIONS_MAP` | `sst.config.ts`                      |
| `sdk-router-function/src/index.handler`      | The deployed Lambda handler (wraps `@summerfi/sdk-server`'s `sdkAppRouter`)                    | `create-backend.ts`                  |
| `sst-environment.ts` `environmentVariables`  | zod-validated env map injected into every deployed Lambda                                      | `create-backend.ts`, `create-backendv3.ts` |
| `sst-environment.ts` `sdkDeployedVersionsMap`| Parsed `SDK_DEPLOYED_VERSIONS_MAP` (`{ "vX": "A.B.C" }`)                                       | `sst.config.ts`                      |

`create-backendv3.ts` / `sst.configv3.ts` are an alternate (v3) app variant — same env source,
same handler.

## The deploy gate (incident-prone)

`sst.config.ts` throws **before deploying anything** unless the current
`./sdk-client/bundle/package.json` `version` is present in `SDK_DEPLOYED_VERSIONS_MAP`:

```
Client pkg version <X> is not in the list of deployed versions: ...
Please update SDK_DEPLOYED_VERSIONS_MAP var in GitHub environment ...
```

So bumping/publishing `sdk-client` **must** be paired with adding that exact semver to the
`SDK_DEPLOYED_VERSIONS_MAP` GitHub-environment variable, or the next SDK deploy is blocked.

## Versioned multi-Lambda routing

For **each** entry in `SDK_DEPLOYED_VERSIONS_MAP`, `create-backend.ts` deploys a
`SdkBackendV<a_b_c>` Function and mounts it at two paths:

- `/sdk/trpc/v<major>/{proxy+}` (current)
- `/api/sdk/v<major>/{proxy+}` (legacy back-compat)

The route major is derived from the **first char** of the semver (`v${version.charAt(0)}`). Two
map entries sharing a major would collide on the same gateway path — keep one version per major, or
old clients pointing at `/vN` break. Each version also gets a CORS-only `OPTIONS` Lambda
(`sdk-router-function/src/options.handler`).

## Environment variables

`sst-environment.ts` is the **authoritative env schema** for the SDK backend: it zod-validates
`process.env` at deploy time (`process.exit(1)` on failure) and exports `environmentVariables`,
which `create-backend.ts` injects wholesale into every Lambda. Env files are loaded by
`sst.config.ts` from `../.env` then `sdk/.env` (override).

**Triple source of truth — a new SDK env var must be added in all three places:**

1. `sst-environment.ts` — add to the zod `envSchema` (validated + injected).
2. `turbo.json` `globalEnv` — `ConfigurationProvider` only loads keys listed here.
3. Read it via `sdk/configuration-provider/src/implementation/ConfigurationProvider.ts`, which
   throws
   `Missing env variable: <name>. Please add it to the stack configuration in sst-environment and turbo.json.`
   if the key is absent from `globalEnv`.

Notable keys (see `sst-environment.ts` for the full list): `SDK_DEPLOYED_VERSIONS_MAP` (deploy
gate), `SDK_RPC_GATEWAY`, `SDK_SUBGRAPH_CONFIG` (JSON; read by `subgraph-manager-service`),
`SUMMER_DEPLOYED_CHAINS_ID` / `_INSTI` / `_DCA` / `_RWA` (chain switchboards consumed by
`sdk-server`'s `createSDKContext`), `EARN_PROTOCOL_DB_CONNECTION_STRING` (needs the VPC),
`FUNCTIONS_API_URL` / `PARTNERS_API_URL` (cross-app URLs, see below).

## Cross-app / VPC coupling

- **Separate SST app.** This is the `versioned-sdk` app, deployed independently of the repo-root
  `summerfi-stack` app (`stacks/summer-stack.ts` / `stacks/partners-stack.ts`). It does **not** use
  SST `use(...)` cross-stack refs; it consumes the other app's endpoints through the
  `FUNCTIONS_API_URL` and `PARTNERS_API_URL` env vars.
- **VPC only on staging/production.** `attachDbVpc` is true only for stages `staging` and
  `production`; both then require `VPC_ID` + `SECURITY_GROUP_ID` (to reach the Postgres DB behind
  `EARN_PROTOCOL_DB_CONNECTION_STRING`). Dev stages (`SST-v2-$SST_USER`) run without a VPC.
- **Retain vs destroy.** Persistent stages set the default removal policy to `retain`; the
  `SdkBucket` is always `DESTROY`.

## Notes

- Adding a new `sdk/*` service/plugin/chain is a **child-package** task — see the checklists in the
  repo-root `AGENTS.md` and `sdk/docs/ADD_SDK_SERVICE.md` / `ADD_NEW_PLUGIN.md`. Only touch this
  directory when the change needs a new env var (schema + `turbo.json`) or a new deployed client
  version (deploy gate).
- The child packages live in this dir but are their own workspaces (`sdk/*` in
  `pnpm-workspace.yaml`); `@summerfi/sdk-infra` itself is excluded from being imported anywhere.
