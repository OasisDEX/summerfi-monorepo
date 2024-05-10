import react from '@vitejs/plugin-react'
import { glob } from 'glob'
import { fileURLToPath } from 'node:url'
import { extname, relative, resolve } from 'path'
import { defineConfig } from 'vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import tsconfigPaths from 'vite-tsconfig-paths'

const fileSliceNumber = 0

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), libInjectCss()],
  build: {
    watch: {
      skipWrite: true,
    },
    copyPublicDir: false,
    lib: {
      // eslint-disable-next-line no-undef
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
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
