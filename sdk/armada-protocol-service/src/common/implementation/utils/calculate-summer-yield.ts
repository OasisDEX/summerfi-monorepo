import { Percentage } from '@summerfi/sdk-common'
import { BigNumber } from 'bignumber.js'

/**
 * Calculates the annual percentage yield (APY) based on daily token emission, token price, and total value locked (TVL).
 *
 * @param params - The parameters required to calculate the APY.
 * @param params.dailyTokenEmissionAmount - The amount of tokens emitted per day, as a string.
 * @param params.tokenPriceUsd - The price of the token in USD, as a string.
 * @param params.tvlUsd - The total value locked (TVL) in USD, as a string.
 * @returns A `Percentage` instance representing the calculated APY.
 */
export const calculateRewardApy = ({
  dailyTokenEmissionAmount,
  tokenPriceUsd,
  tvlUsd,
}: {
  dailyTokenEmissionAmount: string
  tokenPriceUsd: string
  tvlUsd: string
}) => {
  if (new BigNumber(tvlUsd).isZero()) {
    return Percentage.createFrom({ value: 0 })
  }

  const raw = new BigNumber(dailyTokenEmissionAmount)
    .multipliedBy(365)
    .multipliedBy(tokenPriceUsd)
    .dividedBy(tvlUsd)
    .toString()

  return Percentage.createFrom({
    value: Number(raw),
  })
}
