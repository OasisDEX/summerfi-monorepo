export enum PortfolioTabs {
  OVERVIEW = 'overview',
  WALLET = 'wallet',
  YOUR_ACTIVITY = 'your-activity',
  REWARDS = 'rewards',
}

export type ClaimableRewards = {
  rewards: {
    symbol: string
    amount: number
    amountUSD: number
    priceUsd: number
  }[]
  usdAmount: number
}
