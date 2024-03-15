import {
  PERCENT_DECIMALS,
  PositionLike,
  PRICE_DECIMALS,
  Token,
  TokenBalance,
} from '@summerfi/triggers-shared'
import { getTheLeastCommonMultiple, normalizeAmount, normalizeBalance } from './normalize-balance'

export const calculateCollateral = ({
  position,
  collateralToken,
}: {
  position: Pick<PositionLike, 'ltv' | 'debt' | 'collateralPriceInDebt'>
  collateralToken: Token
}): TokenBalance => {
  const { debt, ltv, collateralPriceInDebt } = position

  const LtvTimesPrice = ltv * collateralPriceInDebt
  const ltvTimesPriceDecimals = Number(PRICE_DECIMALS + PERCENT_DECIMALS)

  const commonPrecision = getTheLeastCommonMultiple(ltvTimesPriceDecimals, debt.token.decimals)
  const debtNormalized = normalizeBalance(position.debt, commonPrecision)
  const ltvTimesPriceNormalized = normalizeAmount(
    LtvTimesPrice,
    ltvTimesPriceDecimals,
    commonPrecision,
  )

  const collateral =
    (debtNormalized * BigInt(10 ** collateralToken.decimals)) / ltvTimesPriceNormalized

  return {
    token: collateralToken,
    balance: collateral,
  }
}
