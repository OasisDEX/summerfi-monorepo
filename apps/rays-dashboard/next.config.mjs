import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '/rays',
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    config.externals.push('pino-pretty', 'encoding')

    return config
  },
  transpilePackages: ['@lifi/widget', '@lifi/wallet-management'],
}

export default withNextIntl(nextConfig)
