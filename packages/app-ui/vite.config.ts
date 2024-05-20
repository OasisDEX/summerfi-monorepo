import react from '@vitejs/plugin-react'
import { glob } from 'glob'
import { fileURLToPath } from 'node:url'
import { extname, relative, resolve } from 'path'
import { defineConfig } from 'vite'

// injects the css import at top of the components
import { libInjectCss } from 'vite-plugin-lib-inject-css'
// handles tsconfig paths from the tsconfig.json
import tsconfigPaths from 'vite-tsconfig-paths'
// generates typescript declaration files (just the js/ts, scss is done in package.json)
import dts from 'vite-plugin-dts'
// preserves directives like "use client" in the output
import preserveDirectives from 'rollup-preserve-directives'

// eslint and magic numbers
const fileSliceNumber = 0

// https://vitejs.dev/config/
export default defineConfig({
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
    dts({ outDir: 'dist/types', insertTypesEntry: true, strictOutput: true }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import './node_modules/include-media/dist/_include-media.scss';
        $breakpoints: (
          s: 768px,
          m: 960px,
          l: 1088px,
        );
        `,
      },
    },
  },
  build: {
    emptyOutDir: false,
    cssCodeSplit: true,
    lib: {
      // eslint-disable-next-line no-undef
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'next/link'],
      input: Object.fromEntries(
        glob
          .sync('src/**/*.{ts,tsx}')
          .filter((file) => !file.endsWith('.d.ts'))
          .map((file) => [
            relative('src', file.slice(fileSliceNumber, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
})
