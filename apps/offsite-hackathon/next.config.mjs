import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
  transpilePackages: ['@lifi/widget', '@lifi/wallet-management'],
}

export default withNextIntl(nextConfig)
