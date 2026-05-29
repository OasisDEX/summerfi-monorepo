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
      'mixpanel-browser',
      'zod',
    ],
  },
  // Always a fully static export (served as static files behind a CDN/proxy).
  output: 'export',
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
