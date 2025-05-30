import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { type NetworkNames, type TokenSymbolsList } from '@summerfi/app-types'

export type PortfolioWalletAsset = {
  id: string
  name: string
  network: NetworkNames
  symbol: TokenSymbolsList
  priceUSD: number
  price24hChange?: number
  balance: number
  balanceUSD: number
}

export type PortfolioAssetsResponse = {
  totalAssetsUsdValue: number
  totalAssetsPercentageChange: number
  assets: PortfolioWalletAsset[]
}

export const portfolioWalletAssetsHandler = async (
  walletAddress: string,
): Promise<PortfolioAssetsResponse> => {
  // Return empty, default values if in dev environment
  if (process.env.ENVIRONMENT_TAG === 'dev') {
    return { totalAssetsUsdValue: 0, totalAssetsPercentageChange: 0, assets: [] }
  }

  return await fetch(
    `${process.env.FUNCTIONS_API_URL}/api/portfolio/assets?address=${walletAddress}`,
    {
      next: {
        revalidate: REVALIDATION_TIMES.PORTFOLIO_ASSETS,
        tags: [REVALIDATION_TAGS.PORTFOLIO_ASSETS, walletAddress.toLowerCase()],
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
