import { resolve } from 'path'
import { defineConfig, createLogger } from 'vite'

// generates typescript declaration files (just the js/ts, scss is done in package.json)
import dts from 'vite-plugin-dts'
// compresses svgs (around 40-50% reduction with no build time increase)
import svgo from 'vite-plugin-svgo'

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
      dts({
        include: 'src/**/*',
        outDir: 'dist/types',
        insertTypesEntry: true,
        strictOutput: true,
        copyDtsFiles: true,
      }),
      notDev
        ? svgo({
            multipass: true,
            datauri: 'base64',
            floatPrecision: 2,
          })
        : undefined,
    ],
    customLogger: !notDev ? logger : undefined,
    build: {
      emptyOutDir: notDev, // in dev mode we cant just clear the dist folder
      lib: {
        // eslint-disable-next-line no-undef
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
      },
      rollupOptions: {
        external: ['@loadable/component'],
        input: resolve(__dirname, 'src/index.ts'),
        output: {
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[name].js',
        },
      },
    },
  }
})
