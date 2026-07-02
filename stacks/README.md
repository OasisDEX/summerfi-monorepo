# @summerfi/stacks

SST infrastructure definitions for the `summerfi-stack` app. Holds two top-level stacks —
`summer-stack.ts` (`API`, the main internal API) and `partners-stack.ts` (`ExternalAPI`, the partner
gateway) — plus per-feature `add<Feature>Config(...)` modules and the shared VPC / ElastiCache
bindings (`vpc.ts`, `redis.ts`). Wired by the repo-root `sst.config.ts`.

## Cross-package connections

**Consumes:** nothing at runtime — no `@summerfi/*` imports. devDeps `@summerfi/eslint-config` and
`@summerfi/typescript-config` are build tooling only; `pg` / `kysely` / `kysely-codegen` / `viem` are
declared but not imported by the checked-in stack modules.

**Consumed by:** the repo-root `sst.config.ts`, which imports the `API` and `ExternalAPI` functions
by **relative path** (`./stacks/summer-stack`, `./stacks/partners-stack`), not by the `@summerfi/stacks`
npm name — no other package imports it.

**Gotchas:**

- Lambdas are referenced by **repo-relative source path** (e.g.
  `summerfi-api/get-triggers-function/src/index.handler`, `background-jobs/...`, `external-api/...`),
  not by npm name. There is no `package.json` dependency edge and nothing type-checks the string, so
  renaming/moving a lambda source dir silently breaks the deploy.
- `partners-stack.ts` (`ExternalAPI`) calls `use(API)` to reuse the `API` stack's ElastiCache, so
  **`API` deploys before `ExternalAPI`**.
- `attachVPC` (`vpc.ts`) and `addRedis` (`redis.ts`) return `null` on `dev-*` stages — VPC + managed
  Redis exist only on staging/prod; every module guards with `...(vpc && {...})` / `if (cache) {...}`.
- Env comes from `../.env` via `dotenv` in `sst.config.ts`, **not** from `turbo.json` `globalEnv`;
  each module validates its required vars with a synth-time `throw`.
- See `CLAUDE.md` for the full cross-stack / deploy-ordering / VPC-cache / env-injection coupling and
  the "add a new stack module" checklist.
