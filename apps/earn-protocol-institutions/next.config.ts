import type { NextConfig } from 'next'
import { PHASE_DEVELOPMENT_SERVER } from 'next/dist/shared/lib/constants'

const nextConfig: (phase: string) => NextConfig = (phase) => ({
  devIndicators: {
    position: 'bottom-right',
  },
  basePath: '',
  output: 'standalone',
  reactStrictMode: false,
  experimental: {
    serverComponentsHmrCache: true,
    optimizePackageImports: [
      '@account-kit/core',
      '@account-kit/infra',
      '@account-kit/react',
      '@summerfi/app-earn-ui',
      '@summerfi/app-icons',
      '@summerfi/app-risk',
      '@summerfi/app-tos',
      '@summerfi/app-types',
      '@summerfi/app-utils',
      '@summerfi/app-server-handlers',
      '@summerfi/armada-protocol-abis',
      '@summerfi/sdk-client-react',
      '@summerfi/subgraph-manager-common',
      '@tanstack/react-query',
      'graphql-request',
      'pg',
      'recharts',
      'viem',
      'wagmi',
      'zod',
    ],
  },
  ...(phase !== PHASE_DEVELOPMENT_SERVER
    ? {
        webpack: (config, { webpack }) => {
          config.plugins.push(
            new webpack.IgnorePlugin({
              resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
            }),
          )

          return {
            ...config,
            externals: [...config.externals, 'pino-pretty', 'encoding'],
          }
        },
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
})

export default nextConfig
