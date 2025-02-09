import { type NetworkNames, type TokenSymbolsList } from '@summerfi/app-types'

import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@/constants/revalidations'

export type PortfolioWalletAsset = {
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
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(
        `Failed to fetch user wallet assets on portfolio page. User: ${walletAddress}`,
        error,
      )

      return { totalAssetsUsdValue: 0, totalAssetsPercentageChange: 0, assets: [] }
    })
}
