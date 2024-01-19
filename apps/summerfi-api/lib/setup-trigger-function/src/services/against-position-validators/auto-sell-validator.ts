import {
  AaveAutoSellTriggerData,
  AutoSellTriggerCustomErrorCodes,
  AutoSellTriggerCustomWarningCodes,
  eventBodyAaveBasicSellSchema,
  mapZodResultToValidationResults,
  MINIMUM_LTV_TO_SETUP_TRIGGER,
  positionSchema,
  priceSchema,
  safeParseBigInt,
  ValidationResults,
} from '~types'
import { z } from 'zod'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { AgainstPositionValidator } from './validators-types'

const paramsSchema = z.object({
  position: positionSchema,
  executionPrice: priceSchema,
  body: eventBodyAaveBasicSellSchema,
  triggers: z.custom<GetTriggersResponse>(),
})

const errorsValidation = paramsSchema
  .refine(
    ({ position }) => {
      return position.ltv > MINIMUM_LTV_TO_SETUP_TRIGGER
    },
    {
      message: 'LTV is too low to setup auto sell',
      params: {
        code: AutoSellTriggerCustomErrorCodes.TooLowLtvToSetupAutoSell,
      },
    },
  )
  .refine(
    ({ executionPrice, body }) => {
      return !body.triggerData.useMinSellPrice || body.triggerData.minSellPrice < executionPrice
    },
    {
      message: 'Execution price is smaller than min sell price',
      params: {
        code: AutoSellTriggerCustomErrorCodes.ExecutionPriceSmallerThanMinSellPrice,
      },
      path: ['triggerData', 'minSellPrice'],
    },
  )
  .refine(
    ({ body }) => {
      return body.triggerData.targetLTV < body.triggerData.executionLTV
    },
    {
      message: 'Execution LTV is bigger than target LTV',
      params: {
        code: AutoSellTriggerCustomErrorCodes.ExecutionLTVBiggerThanTargetLTV,
      },
    },
  )
  .refine(
    ({ triggers, body }) => {
      const autoBuyTrigger = triggers.triggers.aaveBasicBuy
      if (!autoBuyTrigger) {
        return true
      }

      const autoBuyTargetLTV = safeParseBigInt(autoBuyTrigger.decodedParams.targetLtv) ?? 0n

      return body.triggerData.executionLTV < autoBuyTargetLTV
    },
    {
      message: 'Auto sell trigger cannot be higher than auto buy target',
      params: {
        code: AutoSellTriggerCustomErrorCodes.AutoSellTriggerHigherThanAutoBuyTarget,
      },
      path: ['triggerData', 'executionLTV'],
    },
  )
  .refine(
    ({ triggers, body }) => {
      const stopLossTrigger = triggers.triggers.aaveStopLossToCollateral
      if (!stopLossTrigger) {
        return true
      }

      const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.ltv) ?? 0n

      return body.triggerData.executionLTV < stopLossTriggerLTV
    },
    {
      message: 'Auto sell cannot be defined with current stop loss',
      params: {
        code: AutoSellTriggerCustomErrorCodes.AutoSellNotAvailableDueToTooHighStopLoss,
      },
      path: ['triggerData', 'executionLTV'],
    },
  )
  .refine(
    ({ body }) => {
      return body.triggerData.useMinSellPrice ? body.triggerData.minSellPrice !== 0n : true
    },
    {
      message: 'Min sell price is not set',
      params: {
        code: AutoSellTriggerCustomErrorCodes.MinSellPriceIsNotSet,
      },
      path: ['triggerData', 'minSellPrice'],
    },
  )

const warningsValidation = paramsSchema
  .refine(
    ({ body, position }) => {
      return position.ltv < body.triggerData.executionLTV
    },
    {
      message: 'Auto sell triggered immediately',
      params: {
        code: AutoSellTriggerCustomWarningCodes.AutoSellTriggeredImmediately,
      },
      path: ['triggerData', 'executionLTV'],
    },
  )
  .refine(
    ({ body, triggers }) => {
      const autoBuyTrigger = triggers.triggers.aaveBasicBuy
      if (!autoBuyTrigger) {
        return true
      }

      const autoBuyTriggerLTV = safeParseBigInt(autoBuyTrigger.decodedParams.executionLtv) ?? 0n

      return autoBuyTriggerLTV < body.triggerData.executionLTV
    },
    {
      message: 'Auto sell target close to auto buy trigger',
      params: {
        code: AutoSellTriggerCustomWarningCodes.AutoSellTargetCloseToAutoBuyTrigger,
      },
      path: ['triggerData', 'executionLTV'],
    },
  )
  .refine(
    ({ body, triggers }) => {
      const stopLossTrigger = triggers.triggers.aaveStopLossToCollateral
      if (!stopLossTrigger) {
        return true
      }

      const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.ltv) ?? 0n

      return stopLossTriggerLTV < body.triggerData.executionLTV
    },
    {
      message: 'Auto sell trigger close to stop loss trigger',
      params: {
        code: AutoSellTriggerCustomWarningCodes.AutoSellTriggerCloseToStopLossTrigger,
      },
      path: ['triggerData', 'executionLTV'],
    },
  )
  .refine(
    ({ body, triggers }) => {
      const stopLossTrigger = triggers.triggers.aaveStopLossToDebt
      if (!stopLossTrigger) {
        return true
      }

      const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.ltv) ?? 0n

      return stopLossTriggerLTV < body.triggerData.executionLTV
    },
    {
      message: 'Auto sell trigger close to stop loss trigger',
      params: {
        code: AutoSellTriggerCustomWarningCodes.AutoSellTriggerCloseToStopLossTrigger,
      },
      path: ['triggerData', 'executionLTV'],
    },
  )
  .refine(
    ({ body }) => {
      return body.triggerData.minSellPrice !== 0n
    },
    {
      message: 'No min sell price when stop loss enabled',
      params: {
        code: AutoSellTriggerCustomWarningCodes.NoMinSellPriceWhenStopLoss,
      },
      path: ['triggerData', 'minSellPrice'],
    },
  )

export const autoSellValidator: AgainstPositionValidator<AaveAutoSellTriggerData> = (
  params,
): ValidationResults => {
  const errorResult = errorsValidation.safeParse(params)

  if (errorResult.success) {
    const warningResult = warningsValidation.safeParse(params)
    if (warningResult.success) {
      return {
        success: true,
        errors: [],
        warnings: [],
      }
    }
    return mapZodResultToValidationResults({ warnings: warningResult.error.errors })
  }

  return mapZodResultToValidationResults({ errors: errorResult.error.errors })
}
