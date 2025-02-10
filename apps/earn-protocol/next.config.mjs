import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/earn',
  output: 'standalone',
  reactStrictMode: false,
  webpack: (config) => {
    return {
      ...config,
      externals: [...config.externals, 'pino-pretty', 'encoding'],
    }
  },
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
  headers: () => {
    return [
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
    ]
  },
  redirects() {
    const redirectToProSummer = (pathname) => ({
      source: pathname,
      destination: `https://pro.summer.fi/${pathname}`,
      basePath: false,
      permanent: true,
    })

    return [
      // product redirects
      redirectToProSummer('/multiply'),
      redirectToProSummer('/borrow'),
      // maker position redirects
      // matches to `/{number}`
      redirectToProSummer('/:makerPosition(\\d{1,})'),
    ]
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
}

export default withNextIntl(nextConfig)
