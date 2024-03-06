import { PERCENT_DECIMALS, Percentage, TokenBalance } from '~types'

export const subtractPercentage = (
  tokenBalance: TokenBalance,
  percentage: Percentage,
): TokenBalance => {
  const percentageSubtraction = (tokenBalance.balance * percentage) / 10n ** PERCENT_DECIMALS
  return {
    ...tokenBalance,
    balance: tokenBalance.balance - percentageSubtraction,
  }
}

export const addPercentage = (tokenBalance: TokenBalance, percentage: Percentage): TokenBalance => {
  const percentageAmount = (tokenBalance.balance * percentage) / 10n ** PERCENT_DECIMALS
  return {
    ...tokenBalance,
    balance: tokenBalance.balance + percentageAmount,
  }
}
