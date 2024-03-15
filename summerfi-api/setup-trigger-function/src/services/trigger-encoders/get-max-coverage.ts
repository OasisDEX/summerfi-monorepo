import { PositionLike, PRICE_DECIMALS } from '@summerfi/triggers-shared'
import { MAX_COVERAGE_BASE } from './defaults'

export const getMaxCoverage = (position: PositionLike) => {
  const maxCoverageInPriceDecimals =
    (MAX_COVERAGE_BASE * 10n ** PRICE_DECIMALS * 10n ** PRICE_DECIMALS) /
    position.oraclePrices.debtPrice

  const exponent = BigInt(position.debt.token.decimals) - PRICE_DECIMALS

  if (exponent >= 0n) {
    return maxCoverageInPriceDecimals * 10n ** exponent
  } else {
    return maxCoverageInPriceDecimals / 10n ** -exponent
  }
}
