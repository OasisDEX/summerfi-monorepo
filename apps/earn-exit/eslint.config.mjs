import { defineConfig } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  {
    ignores: ['next-env.d.ts', 'jest.config.js', 'scripts/**', 'public/**', 'out/**', '.next/**'],
  },
  ...nextVitals,
  {
    rules: {
      // The app's mounted/hydration guards (wagmi SSR) intentionally set state on mount.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
