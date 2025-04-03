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
})

export default nextConfig
