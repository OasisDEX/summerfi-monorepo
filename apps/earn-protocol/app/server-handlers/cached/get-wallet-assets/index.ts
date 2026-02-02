import { type TokenSymbolsList } from '@summerfi/app-types'

import {
  type PortfolioAssetsResponse,
  type PortfolioWalletAsset,
} from '@/app/server-handlers/cached/get-wallet-assets/types'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { getUserDataCacheHandler } from '@/helpers/get-user-data-cache-handler'

export const emptyWalletAssets = {
  totalAssetsUsdValue: 0,
  totalAssetsPercentageChange: 0,
  assets: [],
}

export const getCachedWalletAssets = async (
  walletAddress: string,
  forceNoTag?: boolean,
): Promise<PortfolioAssetsResponse> => {
  // Return empty, default values if in dev environment
  if (process.env.ENVIRONMENT_TAG === 'dev' || forceNoTag) {
    return emptyWalletAssets
  }

  return await fetch(
    `${process.env.FUNCTIONS_API_URL}/api/portfolio/assets?address=${walletAddress}`,
    {
      next: {
        revalidate: CACHE_TIMES.USER_DATA,
        tags: [getUserDataCacheHandler(walletAddress), CACHE_TAGS.PORTFOLIO_DATA],
      },
    },
  )
    .then((resp) => resp.json())
    .then((data) => {
      // Update USDT symbol on Arbitrum network
      const updatedAssets = data.assets.map((asset: PortfolioWalletAsset) => {
        if (asset.network === 'arbitrum' && asset.symbol === 'USDT') {
          return { ...asset, symbol: 'USD₮0' as TokenSymbolsList }
        }

        if (asset.network === 'sonic' && asset.symbol === 'USDC') {
          return { ...asset, symbol: 'USDC.E' as TokenSymbolsList }
        }

        return asset
      })

      return { ...data, assets: updatedAssets }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(
        `Failed to fetch user wallet assets on portfolio page. User: ${walletAddress}`,
        error,
      )

      return { totalAssetsUsdValue: 0, totalAssetsPercentageChange: 0, assets: [] }
    })
}
