import type { NextConfig, Redirect } from 'next'

const redirectToProSummer = (pathname: string) => ({
  source: pathname,
  destination: `https://pro.summer.fi/${pathname}`,
  basePath: false as const, // somehow this can be only false
  permanent: true,
})

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
    appIsrStatus: true,
  },
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
    ])
  },
}

export default nextConfig
