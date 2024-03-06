import { PERCENT_DECIMALS, PositionLike, Price, PRICE_DECIMALS } from '~types'
import { getTheLeastCommonMultiple, normalizeBalance } from '../helpers/normalize-balance'

export function calculateCollateralPriceInDebtBasedOnLtv(
  params: Pick<PositionLike, 'debt' | 'collateral' | 'ltv'>,
): Price {
  const { collateral, debt, ltv } = params
  const collateralDecimals = collateral.token.decimals
  const debtDecimals = debt.token.decimals

  const commonPrecision = getTheLeastCommonMultiple(collateralDecimals, debtDecimals)
  const normalizedCollateral = normalizeBalance(collateral, commonPrecision)
  const normalizedDebt = normalizeBalance(debt, commonPrecision)

  if (normalizedCollateral === 0n || normalizedDebt === 0n || ltv === 0n) {
    return 0n
  }

  return (
    (normalizedDebt * 10n ** PRICE_DECIMALS) /
    ((normalizedCollateral * ltv) / 10n ** PERCENT_DECIMALS)
  )
}
