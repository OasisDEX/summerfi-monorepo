export enum PortfolioTabs {
  OVERVIEW = 'overview',
  WALLET = 'wallet',
  REBALANCE_ACTIVITY = 'rebalance-activity',
  YOUR_ACTIVITY = 'your-activity',
  REWARDS = 'rewards',
  BEACH_CLUB = 'beach-club',
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
