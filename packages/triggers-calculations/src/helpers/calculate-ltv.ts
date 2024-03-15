import {
  LTV,
  PERCENT_DECIMALS,
  Price,
  PRICE_DECIMALS,
  TokenBalance,
} from '@summerfi/triggers-shared'
import { getTheLeastCommonMultiple, normalizeBalance } from './normalize-balance'

export function calculateLtv({
  collateral,
  debt,
  collateralPriceInDebt,
}: {
  collateral: TokenBalance
  debt: TokenBalance
  collateralPriceInDebt: Price
}): LTV {
  const commonPrecision = getTheLeastCommonMultiple(collateral.token.decimals, debt.token.decimals)
  const collateralNormalized = normalizeBalance(collateral, commonPrecision)
  const debtNormalized = normalizeBalance(debt, commonPrecision)

  if (collateralNormalized === 0n || debtNormalized === 0n || collateralPriceInDebt === 0n) {
    return 0n
  }

  return (
    (debtNormalized * 10n ** PERCENT_DECIMALS) /
    ((collateralNormalized * collateralPriceInDebt) / 10n ** BigInt(PRICE_DECIMALS))
  )
}
