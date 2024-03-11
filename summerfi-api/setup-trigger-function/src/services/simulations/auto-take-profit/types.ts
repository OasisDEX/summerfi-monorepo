import {
  AavePartialTakeProfitTriggerData,
  Percentage,
  PositionLike,
  Price,
  SparkPartialTakeProfitTriggerData,
  TokenBalance,
} from '~types'
import { CurrentStopLoss } from '../../trigger-encoders'
import { Logger } from '@aws-lambda-powertools/logger'

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

export type MinimalStopLossInformation = Pick<CurrentStopLoss, 'executionLTV'>

export interface SimulateAutoTakeProfitParams {
  position: PositionLike
  currentStopLoss: MinimalStopLossInformation | undefined
  minimalTriggerData: MinimalAutoTakeProfitTriggerData
  iterations?: number
  logger?: Logger
}

export const FEE: Percentage = 20n // 0.2%
export const SLIPPAGE: Percentage = 10n // 0.1%

export type MinimalPositionLike = Pick<
  PositionLike,
  'collateral' | 'debt' | 'ltv' | 'collateralPriceInDebt'
>
