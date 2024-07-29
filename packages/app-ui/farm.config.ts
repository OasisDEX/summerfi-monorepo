import { defineConfig } from '@farmfe/core'
import farmJsPluginDts from '@farmfe/js-plugin-dts'
import { join } from 'path'

export default defineConfig({
  plugins: [
    '@farmfe/plugin-react',
    [
      '@farmfe/plugin-sass',
      {
        additionalData: `
          @import 'include-media/dist/_include-media.scss';
          $breakpoints: (
            s: 531px,
            m: 744px,
            l: 1025px,
            xl: 1279px,
          );
    `,
      },
    ],
    farmJsPluginDts({
      outputDir: 'dist/types',
      insertTypesEntry: true,
      copyDtsFiles: true,
      aliasesExclude: ['@summerfi/app-types', '@summerfi/app-db'],
    }),
  ],
  compilation: {
    input: {
      lib: 'src/index.ts',
    },
    output: {
      path: 'dist',
    },
    resolve: {
      alias: {
        '@/': join(process.cwd(), 'src'),
      },
    },
    externalNodeBuiltins: ['jest', 'jest-extended'],
    external: [
      '@loadable/component',
      '@summerfi/app-icons',
      '@summerfi/app-types',
      '@tabler/icons-react',
      'bignumber.js',
      'boring-avatars',
      'clsx',
      'lodash',
      'next',
      'next/image',
      'next/link',
      'react',
      'react/jsx-runtime',
      'usehooks-ts',
    ],
  },
})
