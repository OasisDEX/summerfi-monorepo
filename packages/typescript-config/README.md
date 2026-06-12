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
