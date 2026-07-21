import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: { position: 'bottom-right' },
  experimental: {
    optimizePackageImports: ['@summerfi/app-earn-ui', '@summerfi/app-types', '@summerfi/app-utils'],
  },
  // Fully static export — the deployed artifact is the out/ directory.
  output: 'export',
  reactStrictMode: false,
  images: { unoptimized: true },
}

export default nextConfig
