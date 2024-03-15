import { LTV, Percentage, PositionLike, Price, TokenBalance } from '@summerfi/triggers-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { Address } from '@summerfi/serverless-shared'

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

export type MinimalAutoTakeProfitTriggerData = {
  executionPrice: Price
  executionLTV: LTV
  withdrawStep: Percentage
  withdrawToken: Address
}

export type MinimalStopLossInformation = { executionLTV: LTV }

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
