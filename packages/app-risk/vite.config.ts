import react from '@vitejs/plugin-react-swc'
import { glob } from 'glob'
import { fileURLToPath } from 'node:url'
import { extname, relative, resolve } from 'path'
import { createLogger, defineConfig } from 'vite'

// generates typescript declaration files (just the js/ts, css is done in package.json)
import UnpluginIsolatedDecl from 'unplugin-isolated-decl/vite'
// handles tsconfig paths from the tsconfig.json
import tsconfigPaths from 'vite-tsconfig-paths'
// preserves directives like "use client" in the output
import preserveDirectives from 'rollup-preserve-directives'

const logger = createLogger()
const loggerInfo = logger.info

logger.info = (msg, options) => {
  if (msg.includes('dist')) return
  loggerInfo(msg, options)
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const notDev = mode !== 'dev'
  return {
    plugins: [
      react(),
      tsconfigPaths(),
      preserveDirectives(),
      {
        // libInjectCss (with preserveDirectives) adds the css import to the top of the file
        // this custom handle moves the directive ('use client') to the top of the file again
        name: 'custom-swap-directive',
        generateBundle(_, bundle) {
          for (const chunk of Object.values(bundle)) {
            if (chunk.type === 'chunk') {
              if (chunk.code.includes('use client')) {
                chunk.code = chunk.code.replace(/['"]use client['"];/, '')
                chunk.code = `'use client';\n${chunk.code}`
              }
              if (chunk.code.includes('use server')) {
                chunk.code = chunk.code.replace(/['"]use server['"];/, '')
                chunk.code = `'use server';\n${chunk.code}`
              }
            }
          }
        },
      },
      UnpluginIsolatedDecl(),
    ],
    customLogger: !notDev ? logger : undefined,
    clearScreen: false,
    build: {
      emptyOutDir: false,
      cssCodeSplit: true,
      lib: {
        // eslint-disable-next-line no-undef
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
      },
      rollupOptions: {
        external: ['react', 'next', 'next/server', 'zod', 'kysely', '@summerfi/app-utils'],
        input: Object.fromEntries(
          glob
            .sync('src/**/*.{ts,tsx}')
            .filter((file) => !file.endsWith('.d.ts'))
            .map((file) => [
              relative('src', file.slice(0, file.length - extname(file).length)),
              fileURLToPath(new URL(file, import.meta.url)),
            ]),
        ),
        output: {
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[name].js',
        },
      },
    },
  }
})
