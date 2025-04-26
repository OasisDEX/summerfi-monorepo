import type { NextConfig } from 'next'
import { PHASE_DEVELOPMENT_SERVER } from 'next/dist/shared/lib/constants'

const redirectToProSummer = (pathname: string) => ({
  source: pathname,
  destination: `https://pro.summer.fi/${pathname}`,
  basePath: false as const, // somehow this can be only false
  permanent: true,
})

const nextConfig: (phase: string) => NextConfig = (phase) => ({
  devIndicators: {
    position: 'bottom-right',
  },
  experimental: {
    optimizePackageImports: [
      '@summerfi/app-earn-ui',
      '@summerfi/app-types',
      '@summerfi/app-utils',
      '@summerfi/sdk-client',
      '@summerfi/sdk-client-react',
      '@summerfi/sdk-common',
      'graphql-request',
      'graphql-tag',
      'graphql',
      'mixpanel-browser',
      'usehooks-ts',
      'zod',
    ],
  },
  output: 'standalone',
  reactStrictMode: false,
  ...(phase !== PHASE_DEVELOPMENT_SERVER
    ? {
        webpack: (config) => ({
          ...config,
          externals: [...config.externals, 'pino-pretty', 'encoding'],
        }),
      }
    : {}),
  sassOptions: {
    prependData: `
        @import './node_modules/include-media/dist/_include-media.scss';
        $breakpoints: (
          s: 531px,
          m: 744px,
          l: 1025px,
          xl: 1279px,
        );
        `,
  },
  redirects: function () {
    return Promise.resolve([
      // portfolio redirect
      redirectToProSummer('/portfolio/:otherPosition'),
      // product redirects
      redirectToProSummer('/multiply'),
      redirectToProSummer('/borrow'),
      // network + position (or others) redirects
      redirectToProSummer('/ethereum/:otherPosition*'),
      redirectToProSummer('/base/:otherPosition*'),
      redirectToProSummer('/optimism/:otherPosition*'),
      redirectToProSummer('/arbitrum/:otherPosition*'),
      // maker position redirects
      // matches to `/{number}`
      redirectToProSummer('/:makerPosition(\\d{1,})'),
    ])
  },
})

export default nextConfig
