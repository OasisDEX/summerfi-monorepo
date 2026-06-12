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
