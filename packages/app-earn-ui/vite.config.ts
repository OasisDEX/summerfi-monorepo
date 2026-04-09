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
      {
        name: 'optimize-exports',
        generateBundle(_, bundle) {
          // the castings and local typescript fixes are there just to satisfy the type system, they don't affect the actual code
          for (const chunk of Object.values(bundle)) {
            if (chunk.type !== 'chunk' || chunk.fileName !== 'index.js') continue

            let ast
            try {
              ast = this.parse(chunk.code)
            } catch (e) {
              if (e instanceof Error) {
                this.warn(`optimize-exports: failed to parse ${chunk.fileName}: ${e.message}`)
              } else {
                this.warn(`optimize-exports: failed to parse ${chunk.fileName}: unknown error`)
              }
              continue
            }

            const code = chunk.code
            const nodesToRemove = new Set()
            const directReExports = []

            // imported local name -> { imported, sourcePath }
            const importedBindings = new Map()

            for (const node of ast.body) {
              if (node.type !== 'ImportDeclaration') continue

              const sourcePath = node.source.value
              let allConsumable = true

              for (const spec of node.specifiers) {
                if (spec.type === 'ImportSpecifier') {
                  importedBindings.set(spec.local.name, {
                    imported: (
                      spec.imported as {
                        name: string
                      }
                    ).name,
                    sourcePath,
                  })
                } else {
                  // ImportDefaultSpecifier / ImportNamespaceSpecifier — can't convert
                  allConsumable = false
                }
              }

              if (allConsumable) nodesToRemove.add(node)
            }

            for (const node of ast.body) {
              if (node.type !== 'ExportNamedDeclaration') continue
              if (node.source) continue // already a direct re-export
              if (node.declaration) continue // export const/class/function

              const allAreImported = node.specifiers.every((s) =>
                importedBindings.has((s.local as { name: string }).name),
              )
              if (!allAreImported) continue // exports a local binding — leave it

              for (const spec of node.specifiers) {
                const binding = importedBindings.get((spec.local as { name: string }).name)
                const exportedName = (spec.exported as { name: string }).name
                const importedName = binding.imported

                const clause =
                  importedName !== exportedName
                    ? `${importedName} as ${exportedName}`
                    : importedName

                directReExports.push(`export { ${clause} } from "${binding.sourcePath}";`)
                importedBindings.delete((spec.local as { name: string }).name)
              }

              nodesToRemove.add(node)
            }

            // Re-check: if an import node had some bindings left unconsumed, don't remove it
            for (const node of [...nodesToRemove]) {
              const castedNode = node as any
              if (castedNode.type !== 'ImportDeclaration') continue
              const hasUnconsumed = castedNode.specifiers.some(
                (s: any) =>
                  s.type === 'ImportSpecifier' &&
                  importedBindings.has((s.local as { name: string }).name),
              )
              if (hasUnconsumed) nodesToRemove.delete(node)
            }

            if (nodesToRemove.size === 0 && directReExports.length === 0) continue

            // Build output by slicing around removed nodes, sorted by position
            const removed = [...nodesToRemove].sort((a, b) => (a as any).start - (b as any).start)
            let result = ''
            let cursor = 0

            for (const node of removed) {
              result += code.slice(cursor, (node as any).start)
              // Advance past the node and any immediately following newline
              cursor = (node as any).end
              if (code[cursor] === '\n') cursor++
            }

            result += code.slice(cursor)

            chunk.code =
              directReExports.length > 0 ? directReExports.join('\n') + '\n' + result : result
          }
        },
      },
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
          '@privy-io/react-auth',
          '@privy-io/wagmi',
          '@loadable/component',
          '@summerfi/app-icons',
          '@summerfi/armada-protocol-common',
          '@summerfi/summer-earn-rates-subgraph',
          '@tanstack/react-query',
          'viem',
          'viem/chains',
          'wagmi',
          'wagmi/connectors',
          'bignumber.js',
          'clsx',
          'dayjs',
          'lodash-es',
          'next',
          'next/image',
          'next/link',
          'next/script',
          'next/navigation',
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
          'boring-avatars',
          'react-animate-height',
          'uniqolor',
          'react-day-picker',
          'react-toastify',
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
