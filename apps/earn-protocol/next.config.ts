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
