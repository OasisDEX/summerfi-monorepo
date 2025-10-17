import { resolve } from 'path'
import { defineConfig, createLogger } from 'vite'

// generates typescript declaration files (just the js/ts, css is done in package.json)
import UnpluginIsolatedDecl from 'unplugin-isolated-decl/vite'
// compresses svgs (around 40-50% reduction with no build time increase)
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

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
      svgr({
        svgrOptions: {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            floatPrecision: 2,
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                    cleanupIds: false,
                  },
                },
              },
            ],
          },
        },
      }),
      UnpluginIsolatedDecl(),
    ],
    customLogger: !notDev ? logger : undefined,
    clearScreen: false,
    build: {
      emptyOutDir: false,
      lib: {
        // eslint-disable-next-line no-undef
        entry: {
          index: resolve(__dirname, 'src/index.ts'),
          static: resolve(__dirname, 'src/static.ts'),
        },
        formats: ['es'],
      },
      rollupOptions: {
        external: ['react', 'react/jsx-runtime'],
        input: {
          index: resolve(__dirname, 'src/index.ts'),
          static: resolve(__dirname, 'src/static.ts'),
        },
        output: {
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[name].js',
        },
      },
    },
  }
})
