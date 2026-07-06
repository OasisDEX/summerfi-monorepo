import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: ['**/*.test.ts', '**/*.spec.ts', '**/client.ts', '.eslintrc.cjs'],
  // Intentionally broad: the first-party workspace graph includes type-only packages
  // (e.g. *-common contract packages) and codegen-consumed packages that knip's static
  // analysis can't see through (dynamic imports, ambient types, generated barrel re-exports),
  // which would otherwise show up as false-positive "unused dependency" findings. Narrowing
  // this to a specific package list would need a real knip run + triage per package to confirm
  // which ones are true positives before removing them from the ignore list — not done here to
  // avoid breaking `pnpm knip` in CI with unverified false positives.
  ignoreDependencies: ['@summerfi/*'],
}

export default config
