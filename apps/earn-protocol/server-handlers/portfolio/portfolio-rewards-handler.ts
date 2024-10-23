import { type TokenSymbolsList } from '@summerfi/app-types'

export type PortfolioRewardsRawData = {
  symbol: TokenSymbolsList
  sumrEarned: number
  sumrPerDay: number
}

const portfolioRewardsRawData: PortfolioRewardsRawData[] = [
  {
    symbol: 'USDC',
    sumrEarned: 32323,
    sumrPerDay: 1234,
  },
  {
    symbol: 'USDT',
    sumrEarned: 32323,
    sumrPerDay: 1234,
  },
  {
    symbol: 'ETH',
    sumrEarned: 32323,
    sumrPerDay: 1234,
  },
  {
    symbol: 'WBTC',
    sumrEarned: 32323,
    sumrPerDay: 1234,
  },
]

export const portfolioRewardsHandler = async (
  _walletAddress: string,
): Promise<PortfolioRewardsRawData[]> => {
  return await new Promise((resolve) => {
    resolve(portfolioRewardsRawData)
  })
}
