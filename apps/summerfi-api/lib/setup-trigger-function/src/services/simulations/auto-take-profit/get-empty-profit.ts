import { PositionLike } from '~types'
import { AutoTakeProfitRealized } from './types'

export const getEmptyProfit = (position: PositionLike): AutoTakeProfitRealized => {
  return {
    triggerPrice: 0n,
    realizedProfitInCollateral: { balance: 0n, token: position.collateral.token },
    realizedProfitInDebt: { balance: 0n, token: position.debt.token },
    totalProfitInCollateral: { balance: 0n, token: position.collateral.token },
    totalProfitInDebt: { balance: 0n, token: position.debt.token },
    fee: { balance: 0n, token: position.collateral.token },
    totalFee: { balance: 0n, token: position.collateral.token },
  }
}
