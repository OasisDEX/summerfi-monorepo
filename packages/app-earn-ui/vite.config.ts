import react from '@vitejs/plugin-react-swc'
import { glob } from 'glob'
import { fileURLToPath } from 'node:url'
import { extname, relative, resolve } from 'path'
import { defineConfig, createLogger } from 'vite'

// injects the css import at top of the components
import { libInjectCss } from 'vite-plugin-lib-inject-css'
// handles tsconfig paths from the tsconfig.json
import tsconfigPaths from 'vite-tsconfig-paths'
// preserves directives like "use client" in the output
import preserveDirectives from 'rollup-preserve-directives'
// generates .d.ts files
import UnpluginIsolatedDecl from 'unplugin-isolated-decl/vite'
import path from 'node:path'

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
        ...libInjectCss(),
        enforce: 'pre', // this is important to make sure the css is injected before the code is processed
      },
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
      UnpluginIsolatedDecl({
        rewriteImports: (id: string, importer: string) => {
          if (id.startsWith('@/') && id.endsWith('.css')) {
            // the files are in the same folder, so we just need `./{file}.css`
            const fileName = path.basename(id, '.css')
            return `./${fileName}.css`
          }
          if (id.startsWith('@/') && !id.endsWith('.css')) {
            const cleanId = id.replace('@/', './dist/src/')
            const relativePath = relative(importer, cleanId)
            return relativePath
          }
          if (id.startsWith('@/')) {
            console.log(`Missing rewrite imports config: ${importer}, id: ${id}`)
          }
          return id
        },
      }),
    ],
    customLogger: !notDev ? logger : undefined,
    clearScreen: false,
    build: {
      emptyOutDir: false,
      cssCodeSplit: true,
      sourcemap: false,
      cssMinify: notDev,
      lib: {
        // eslint-disable-next-line no-undef
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
      },
      rollupOptions: {
        external: [
          '@account-kit/core',
          '@account-kit/infra',
          '@account-kit/react',
          '@account-kit/signer',
          '@loadable/component',
          '@summerfi/app-icons',
          '@summerfi/armada-protocol-common',
          'bignumber.js',
          'clsx',
          'dayjs',
          'lodash-es',
          'next',
          'next/image',
          'next/link',
          'react',
          'react-dom',
          'react/jsx-runtime',
          'usehooks-ts',
          '@summerfi/app-token-config',
          '@summerfi/app-types',
          '@summerfi/app-utils',
          'embla-carousel-react',
          'embla-carousel',
          '@number-flow/react',
        ],
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
          dir: resolve(__dirname, 'dist/src'),
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[name].js',
        },
      },
    },
  }
})
