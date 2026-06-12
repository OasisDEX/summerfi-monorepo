# remove-barrel-files

Node.js CLI script that rewrites `export *` barrel re-exports into explicit named exports and then
deletes the intermediate barrel `index.ts` files.

## What it does

1. Reads `src/index.ts` of each target package, finds every `export * from './...'` line, and
   recursively resolves the real source files.
2. Rewrites those lines into explicit `export { ... }` / `export type { ... }` statements pointing
   directly at the source files.
3. Deletes all non-root `index.ts` files whose content consists entirely of `export *`,
   `export type *`, `export { type ... }`, or `export type { ... }` lines.

## Usage

```
node scripts/remove-barrel-files/remove-barrel-files.js <package-path-or-monorepo-root> [--dry]
```

Pass `--dry` to preview changes without writing or deleting anything. Pass a path containing
`package.json` to process a single package; pass a folder without one to discover and process all
nested packages.

## Gotcha

The script resolves exports with regex, not the TypeScript compiler. Aliased re-exports
(`export { Foo as Bar }`) are collected but the `as Bar` alias is stripped — only the original name
is emitted in the rewritten index.
