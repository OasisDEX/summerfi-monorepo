import { type IArmadaVaultInfo } from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

/**
 * Gets the annual rewards token bonus for reward tokens
 * @param merklRewards - Array of daily emission amounts for all reward tokens
 * @param tokensPriceMap - Map of token symbols to their current price in USD
 * @param totalValueLockedUSD - Total value locked in the vault in USD
 */
export const getRewardsTokenBonus = ({
  merklRewards,
  tokensPriceMap,
  totalValueLockedUSD,
}: {
  merklRewards?: IArmadaVaultInfo['merklRewards']
  tokensPriceMap?: {
    [tokenSymbol: string]: number
  }
  totalValueLockedUSD: string
}): {
  tokenBonus: string
  rawTokenBonus: string
  totalAnnualRewardsPerToken: {
    [tokenSymbol: string]: number
  }
} => {
  if (!merklRewards) {
    return { tokenBonus: '0%', rawTokenBonus: '0', totalAnnualRewardsPerToken: {} }
  }

  let totalAnnualRewardsUSD = 0
  const totalAnnualRewardsPerToken: { [tokenSymbol: string]: number } = {}

  merklRewards.forEach((reward) => {
    const tokenPrice = tokensPriceMap?.[reward.token.symbol.toUpperCase()]

    if (tokenPrice) {
      const bonusDaily = Number(reward.dailyEmission) / Number(10 ** reward.token.decimals)
      const bonusAnnual = bonusDaily * 365
      const bonusValueAnnual = bonusAnnual * tokenPrice

      totalAnnualRewardsUSD += bonusValueAnnual
      totalAnnualRewardsPerToken[reward.token.symbol.toUpperCase()] =
        Number(totalValueLockedUSD) > 0 ? bonusValueAnnual / Number(totalValueLockedUSD) : 0
    }
  })

  const raw =
    Number(totalValueLockedUSD) > 0
      ? (totalAnnualRewardsUSD / Number(totalValueLockedUSD)).toString()
      : '0'

  return {
    tokenBonus: formatDecimalAsPercent(raw),
    rawTokenBonus: raw,
    totalAnnualRewardsPerToken,
  }
}
