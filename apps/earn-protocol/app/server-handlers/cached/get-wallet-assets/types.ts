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
