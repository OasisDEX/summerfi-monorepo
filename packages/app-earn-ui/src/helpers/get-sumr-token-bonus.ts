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
 * const bonus = getSumrTokenBonus(
 *   rewardTokens,
 *   rewardTokenEmissionsAmount,
 *   1.23, // SUMMER price in USD
 *   "1000000" // $1M TVL
 * )
 * // Returns something like { sumrTokenBonus: "5.67%", rawSumrTokenBonus: "0.0567" }
 */
export const getSumrTokenBonus = (
  rewardTokens: SDKVaultishType['rewardTokens'],
  rewardTokenEmissionsAmount: SDKVaultishType['rewardTokenEmissionsAmount'],
  sumrPrice: number | undefined,
  totalValueLockedUSD: string,
  rewardTokenEmissionsFinish: SDKVaultishType['rewardTokenEmissionsFinish'],
): { sumrTokenBonus: string; rawSumrTokenBonus: string } => {
  const sumrIndex = rewardTokens.findIndex(
    // BUMMER to be removed after prod deployment
    (item) => item.token.symbol === 'SUMR' || item.token.symbol === 'BUMMER',
  )

  const bonusSumrDaily = rewardTokenEmissionsAmount[sumrIndex]
    ? // eslint-disable-next-line no-mixed-operators
      Number(rewardTokenEmissionsAmount[sumrIndex]) / 10 ** 36
    : 0

  const emissionsFinish = rewardTokenEmissionsFinish[sumrIndex]
    ? Number(rewardTokenEmissionsFinish[sumrIndex]) * 1000
    : undefined

  const dateNow = new Date().getTime()

  const raw =
    sumrPrice && Number(totalValueLockedUSD) && emissionsFinish && emissionsFinish > dateNow
      ? ((bonusSumrDaily * 365 * sumrPrice) / Number(totalValueLockedUSD)).toString()
      : '0'

  return {
    sumrTokenBonus: formatDecimalAsPercent(raw),
    rawSumrTokenBonus: raw,
  }
}
