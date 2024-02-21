import {
  getPropertyFromTriggerParams,
  GetTriggersResponse,
} from '@summerfi/serverless-contracts/get-triggers-response'
import { safeParseBigInt } from '@summerfi/serverless-shared'
import { PositionLike } from '~types'
import { CurrentStopLoss } from './types/current-stop-loss'
import { Logger } from '@aws-lambda-powertools/logger'
import { calculateLtv } from './calculate-ltv'
import { calculateCollateralPriceInDebtBasedOnLtv } from './calculate-collateral-price-in-debt-based-on-ltv'

export function getCurrentStopLoss(
  triggers: GetTriggersResponse,
  position: PositionLike,
  logger?: Logger,
): CurrentStopLoss | undefined {
  const currentStopLoss = triggers.triggerGroup.aaveStopLoss

  if (!currentStopLoss) {
    return undefined
  }

  const executionLtv = safeParseBigInt(
    getPropertyFromTriggerParams({
      trigger: currentStopLoss,
      property: 'executionLtv',
    }),
  )

  const executionPrice = safeParseBigInt(
    getPropertyFromTriggerParams({
      trigger: currentStopLoss,
      property: 'executionPrice',
    }),
  )

  if (executionLtv === undefined || executionPrice === undefined) {
    logger?.warn('Execution LTV or price is not set on the trigger')
    return undefined
  }

  const stopLossExecutionLtv =
    executionLtv ??
    calculateLtv({
      ...position,
      collateralPriceInDebt: executionPrice,
    })

  const stopLossExecutionPrice =
    executionPrice ??
    calculateCollateralPriceInDebtBasedOnLtv({
      ...position,
      ltv: stopLossExecutionLtv,
    })

  return {
    triggerData: currentStopLoss.triggerData as `0x${string}`,
    id: safeParseBigInt(currentStopLoss.triggerId) ?? 0n,
    executionLTV: stopLossExecutionLtv,
    executionPrice: stopLossExecutionPrice,
  }
}
