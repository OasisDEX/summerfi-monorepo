# @summerfi/typescript-config

Shared TypeScript `tsconfig` presets for the monorepo. Private — not published to npm.

## Presets

| File                   | Purpose                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `tsconfig.base.json`   | ES2022 + Bundler resolution, strict, composite, declaration maps; extends `@tsconfig/node20`. Used by most backend/library packages. |
| `tsconfig.nextjs.json` | Extends base; adds `jsx: preserve`, `allowJs`, and the Next.js language-server plugin. Used by Next.js app packages.                 |
| `tsconfig.test.json`   | Extends base with `noEmit: true`; includes `ts-node` settings for running Jest/ts-node tests directly.                               |

## Usage

In a consuming package's `tsconfig.json`:

```json
{ "extends": "@summerfi/typescript-config/tsconfig.base.json" }
```

## Gotcha

`tsconfig.base.json` includes a hardcoded `references` list. Adding a new package that needs project
references requires updating that list here as well.

## Cross-package connections

**Consumes:** nothing in `@summerfi/*` — extends the external `@tsconfig/node20` preset only.

**Consumed by:** ~100 workspace packages, via `"extends": "@summerfi/typescript-config/..."` in
their `tsconfig*.json` (not via TS `import`). SDK services/commons (`sdk-common`, `sdk-server`,
`sdk-client`, `protocol-plugins`, `tokens-service`, ...), shared libs (`serverless-shared`,
`app-utils`, `app-earn-ui`, `app-types`, ...), lambdas (`summerfi-api/*`, `external-api/*`,
`background-jobs/*`), and the Next.js apps (`earn-protocol`, `earn-protocol-institutions`,
`earn-protocol-landing-page` extend `tsconfig.nextjs.json`). Declared as a `devDependency` in each
consumer's `package.json`.

**Gotchas:**

- The coupling is `tsconfig` `extends`, not a JS import — grepping for `from '@summerfi/typescript-config'`
  finds nothing. Consumers reference it by file path (`tsconfig.base.json` / `tsconfig.nextjs.json` /
  `tsconfig.test.json`); renaming or moving a preset breaks every extender silently at build time.
- The `references` array in `tsconfig.base.json` uses `../<pkg>` paths **relative to this package's
  directory**, not to the extending package. It is a fixed list (serverless-shared, the `*-subgraph`
  clients, triggers-calculations/-shared, abstractions, redis-cache, defi-llama-client) that must be
  edited here when a new project-referenced package is added — see the Gotcha above.
- `compilerOptions.types` is hardcoded to `["node", "jest", "jest-extended"]`, so every extending
  package gets Jest globals ambiently, even non-test packages. `strict`, `composite`, `isolatedModules`,
  and `moduleResolution: "Bundler"` are inherited repo-wide; changing any of them here re-typechecks the
  whole monorepo.
- `tsBuildInfoFile` uses the `${configDir}` template variable (TS 5.5+). A stale `${configDir}/`
  directory in this package is an artifact of older tooling that did not resolve the variable; it is not
  a consumed path.
