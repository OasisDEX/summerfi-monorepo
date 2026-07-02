# @summerfi/app-icons

SVG icon library for the Summerfi monorepo. Ships 380 SVG files as React components via
`vite-plugin-svgr`.

## Exports

- **`.` (`src/index.ts`)** — `icons` map of lazily-loaded React SVG components (`React.lazy`),
  suitable for standard app pages.
- **`./static` (`src/static.ts`)** — `iconsSync` map of eagerly-loaded promise imports, used only in
  OG image generation where lazy loading is not available.

## Who uses it

Any app package that renders token/protocol icons. Import from the root export for regular UI;
import from `./static` only when rendering OG images server-side.

## Adding a new token

1. Drop the SVG file into `src/icons/` (e.g. `<symbol>_circle_color.svg`).
2. Register it in `src/index.ts` as a `customLazy` entry in the `icons` map.
3. If OG image support is needed, add the matching entry to `src/static.ts` as well.

## Build

```
pnpm build   # vite build (ESM, dist/)
pnpm dev     # watch mode
```

## Cross-package connections

**Consumes:** nothing at runtime — `src/index.ts` / `src/static.ts` only `import`
the raw `./icons/*.svg?react` files (turned into React components by `vite-plugin-svgr`) and
`react`. `@summerfi/app-types` is a `devDependency` but is never `import`ed here; it holds the
mirror-image type unions (see gotcha below). `@summerfi/eslint-config` /
`@summerfi/typescript-config` are build tooling only.

**Consumed by:** `app-earn-ui` (`src/components/atoms/Icon/Icon.tsx` imports the `icons` map and
resolves `icons[iconName]`), and `earn-protocol` OG routes
(`app/api/og/vault/route.tsx`, `app/api/og/vault-position/route.tsx`) which import the eager
`@summerfi/app-icons/static` `iconsSync` map. `earn-protocol`, `earn-protocol-institutions`
(`next.config.ts` `transpilePackages`) and `app-earn-ui` (`vite.config.ts`) list it as a
transpiled/external package so the `?react` SVG imports resolve at build time.

**Gotchas:**

- **Dual source of truth — the `icons` map keys must match `IconNamesList` in app-types.** This
  package's `icons`/`iconsSync` keys (`src/index.ts`, `src/static.ts`) and the
  `IconNamesList` / `TokenSymbolsList` string-literal unions in
  `packages/app-types/types/src/icons/index.ts` are maintained independently — there is no import
  linking them. `Icon.tsx` types `iconName`/`tokenName` off the app-types unions and looks the value
  up in the runtime `icons` map, so the two drift silently: a key present in app-types but missing
  from the map renders nothing (undefined component); a key in the map but not in the union can't be
  referenced from a typed caller. Add both together (see AGENTS.md "Add a new token — frontend
  apps").
- **Two exports, keep them in sync too.** `.` (`icons`, lazy `React.lazy`) and `./static`
  (`iconsSync`, eager) are hand-maintained separate maps. OG image generation (`app/api/og/*`) can't
  use `React.lazy`, so a new icon needed in OG images must be added to `src/static.ts` as well as
  `src/index.ts`.
- `isolatedDeclarations: true` is why the React icon type is re-declared locally in `index.ts`
  instead of imported — don't "fix" it by importing react types.
