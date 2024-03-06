import {
  AavePartialTakeProfitTriggerData,
  Percentage,
  PositionLike,
  Price,
  SparkPartialTakeProfitTriggerData,
  TokenBalance,
} from '~types'
import { CurrentStopLoss } from '../../trigger-encoders'

export interface AutoTakeProfitRealized {
  triggerPrice: Price
  realizedProfitInCollateral: TokenBalance
  realizedProfitInDebt: TokenBalance
  totalProfitInCollateral: TokenBalance
  totalProfitInDebt: TokenBalance
  stopLossDynamicPrice?: Price
  fee: TokenBalance
  totalFee: TokenBalance
}
export interface AutoTakeProfitSimulation {
  profits: AutoTakeProfitRealized[]
}

export type MinimalAutoTakeProfitTriggerData = Pick<
  AavePartialTakeProfitTriggerData | SparkPartialTakeProfitTriggerData,
  'executionPrice' | 'executionLTV' | 'withdrawStep' | 'withdrawToken'
>

export interface SimulateAutoTakeProfitParams {
  position: PositionLike
  currentStopLoss: CurrentStopLoss | undefined
  minimalTriggerData: MinimalAutoTakeProfitTriggerData
  iterations?: number
}

export const FEE: Percentage = 20n // 0.2%
export const SLIPPAGE: Percentage = 10n // 0.1%

export type MinimalPositionLike = Pick<
  PositionLike,
  'collateral' | 'debt' | 'ltv' | 'collateralPriceInDebt'
>
