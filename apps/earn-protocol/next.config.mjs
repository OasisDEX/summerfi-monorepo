import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'encoding')

    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['@summerfi/sdk-client', '@summerfi/sdk-common'],
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
}

export default withNextIntl(nextConfig)
