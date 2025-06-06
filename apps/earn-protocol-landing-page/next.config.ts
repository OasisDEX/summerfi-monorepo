import type { NextConfig } from 'next'
import { PHASE_DEVELOPMENT_SERVER } from 'next/dist/shared/lib/constants'

const nextConfig: (phase: string) => NextConfig = (phase) => ({
  devIndicators: {
    position: 'bottom-right',
  },
  env: {
    EARN_APP_URL: process.env.EARN_APP_URL,
  },
  experimental: {
    serverComponentsHmrCache: true,
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
  output: phase !== PHASE_DEVELOPMENT_SERVER ? 'export' : 'export',
  reactStrictMode: false,
  ...(phase !== PHASE_DEVELOPMENT_SERVER
    ? {
        webpack: (config) => ({
          ...config,
          externals: [...config.externals, 'pino-pretty', 'encoding'],
        }),
      }
    : {}),
  images: {
    unoptimized: true,
  },
})

export default nextConfig
