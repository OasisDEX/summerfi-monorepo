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
  basePath: '/earn',
  output: 'standalone',
  reactStrictMode: false,
  experimental: {
    serverComponentsHmrCache: true,
    optimizePackageImports: [
      '@account-kit/core',
      '@account-kit/infra',
      '@account-kit/react',
      '@account-kit/signer',
      '@layerzerolabs/scan-client',
      '@safe-global/safe-apps-sdk',
      '@summerfi/app-earn-ui',
      '@summerfi/app-icons',
      '@summerfi/app-risk',
      '@summerfi/app-tos',
      '@summerfi/app-types',
      '@summerfi/app-utils',
      '@summerfi/armada-protocol-abis',
      '@summerfi/sdk-client-react',
      '@summerfi/sdk-common',
      '@summerfi/subgraph-manager-common',
      '@summerfi/summer-protocol-db',
      '@tanstack/react-query',
      '@transak/transak-sdk',
      'graphql-request',
      'mixpanel-browser',
      'pg',
      'recharts',
      'viem',
      'wagmi',
      'zod',
    ],
  },
  ...(phase !== PHASE_DEVELOPMENT_SERVER
    ? {
        webpack: (config) => ({
          ...config,
          externals: [...config.externals, 'pino-pretty', 'encoding'],
        }),
      }
    : {}),
  headers: function () {
    return Promise.resolve([
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, content-type, Authorization',
          },
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors "self" https://app.safe.global;',
          },
        ],
      },
    ])
  },
  redirects: function () {
    return Promise.resolve([
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
      // dsr position redirects
      redirectToProSummer('/earn/dsr/:otherPosition*'),
    ])
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.tally.xyz',
        pathname: '/**',
      },
    ],
  },
})

export default nextConfig
