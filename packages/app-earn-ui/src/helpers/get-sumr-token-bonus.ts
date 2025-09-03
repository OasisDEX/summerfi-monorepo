import { type IArmadaVaultInfo } from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

/**
 * Calculates the annual SUMMER token bonus percentage for a vault
 * @param merklRewards - Array of daily emission amounts corresponding to SUMR token
 * @param sumrPrice - Current price of SUMMER token in USD
 * @param totalValueLockedUSD - Total value locked in the vault in USD
 * @returns Formatted percentage string representing annual SUMMER token bonus (e.g., "12.34%")
 *
 * @example
 * const bonus = getSumrTokenBonus(
 *   merklRewards,
 *   sumrPrice,
 *   1.23, // SUMMER price in USD
 *   "1000000" // $1M TVL
 * )
 * // Returns something like { sumrTokenBonus: "5.67%", rawSumrTokenBonus: "0.0567" }
 */
export const getSumrTokenBonus = ({
  merklRewards,
  sumrPrice,
  totalValueLockedUSD,
}: {
  merklRewards?: IArmadaVaultInfo['merklRewards']
  sumrPrice: number | undefined
  totalValueLockedUSD: string
}): { sumrTokenBonus: string; rawSumrTokenBonus: string } => {
  if (!merklRewards) {
    return { sumrTokenBonus: '0%', rawSumrTokenBonus: '0' }
  }

  const sumrMerklReward = merklRewards.find((item) => item.token.symbol === 'SUMR')

  const bonusSumrDaily = sumrMerklReward
    ? // eslint-disable-next-line no-mixed-operators
      Number(sumrMerklReward.dailyEmission) / 10 ** 18
    : 0

  const raw =
    sumrPrice && Number(totalValueLockedUSD)
      ? ((bonusSumrDaily * 365 * sumrPrice) / Number(totalValueLockedUSD)).toString()
      : '0'

  return {
    sumrTokenBonus: formatDecimalAsPercent(raw),
    rawSumrTokenBonus: raw,
  }
}
