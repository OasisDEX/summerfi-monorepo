import { type SDKVaultishType } from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

/**
 * Calculates the annual SUMMER token bonus percentage for a vault
 * @param rewardTokens - Array of reward tokens available for the vault
 * @param rewardTokenEmissionsAmount - Array of daily emission amounts corresponding to reward tokens
 * @param sumrPrice - Current price of SUMMER token in USD
 * @param totalValueLockedUSD - Total value locked in the vault in USD
 * @returns Formatted percentage string representing annual SUMMER token bonus (e.g., "12.34%")
 *
 * @example
 * const bonus = calculateTokenBonus(
 *   rewardTokens,
 *   rewardTokenEmissionsAmount,
 *   1.23, // SUMMER price in USD
 *   "1000000" // $1M TVL
 * )
 * // Returns something like "5.67%"
 */
export const getSumrTokenBonus = (
  rewardTokens: SDKVaultishType['rewardTokens'],
  rewardTokenEmissionsAmount: SDKVaultishType['rewardTokenEmissionsAmount'],
  sumrPrice: number | undefined,
  totalValueLockedUSD: string,
): string => {
  const sumrIndex = rewardTokens.findIndex((item) => item.token.symbol === 'SUMMER')

  const bonusSumrDaily = rewardTokenEmissionsAmount[sumrIndex]
    ? // eslint-disable-next-line no-mixed-operators
      Number(rewardTokenEmissionsAmount[sumrIndex]) / 10 ** 18
    : 0

  return formatDecimalAsPercent(
    sumrPrice && Number(totalValueLockedUSD)
      ? ((bonusSumrDaily * 365 * sumrPrice) / Number(totalValueLockedUSD)).toString()
      : '0',
  )
}
