import {
  getPropertyFromTriggerParams,
  GetTriggersResponse,
} from '@summerfi/serverless-contracts/get-triggers-response'
import { safeParseBigInt } from '@summerfi/serverless-shared'
import { PositionLike } from '~types'
import { Logger } from '@aws-lambda-powertools/logger'
import { calculateLtv } from './calculate-ltv'
import { calculateCollateralPriceInDebtBasedOnLtv } from './calculate-collateral-price-in-debt-based-on-ltv'
import { CurrentStopLoss } from './trigger-encoders'

export function getCurrentSparkStopLoss(
  triggers: GetTriggersResponse,
  position: PositionLike,
  logger?: Logger,
): CurrentStopLoss | undefined {
  const currentStopLoss = triggers.triggerGroup.sparkStopLoss

  if (!currentStopLoss) {
    return undefined
  }

  const executionLtv = safeParseBigInt(
    getPropertyFromTriggerParams({
      trigger: currentStopLoss,
      property: 'executionLtv',
    }),
  )

  const ltv = safeParseBigInt(
    getPropertyFromTriggerParams({
      trigger: currentStopLoss,
      property: 'ltv',
    }),
  )

  const executionPrice = safeParseBigInt(
    getPropertyFromTriggerParams({
      trigger: currentStopLoss,
      property: 'executionPrice',
    }),
  )

  if (executionLtv === undefined && ltv === undefined && executionPrice === undefined) {
    logger?.warn('Stop loss trigger has no executionLtv or executionPrice')
    return undefined
  }

  const stopLossExecutionLtv =
    executionLtv ??
    ltv ??
    calculateLtv({
      ...position,
      collateralPriceInDebt: executionPrice!,
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
    triggersOnAccount: triggers.triggersCount,
  }
}
