import { glob } from 'glob'
import { fileURLToPath } from 'node:url'
import { extname, relative, resolve } from 'path'
import { defineConfig } from 'vite'

// handles tsconfig paths from the tsconfig.json
import tsconfigPaths from 'vite-tsconfig-paths'
// generates typescript declaration files (just the js/ts, scss is done in package.json)
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({ outDir: 'dist/types', insertTypesEntry: true, strictOutput: true, copyDtsFiles: true }),
  ],
  build: {
    emptyOutDir: false,
    lib: {
      // eslint-disable-next-line no-undef
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('src/**/*.{ts,tsx}')
          .filter((file) => !file.endsWith('.d.ts'))
          .map((file) => [
            relative('src', file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
      external: ['bignumber.js'],
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
})
