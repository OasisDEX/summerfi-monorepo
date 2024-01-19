import {
  ONE_PERCENT,
  positionSchema,
  priceSchema,
  mapZodResultToValidationResults,
  AutoBuyTriggerCustomErrorCodes,
  eventBodyAaveBasicBuySchema,
  safeParseBigInt,
  AutoBuyTriggerCustomWarningCodes,
  MINIMUM_LTV_TO_SETUP_TRIGGER,
  AaveAutoBuyTriggerData,
} from '~types'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { z } from 'zod'
import { AgainstPositionValidator } from './validators-types'

const paramsSchema = z.object({
  position: positionSchema,
  executionPrice: priceSchema,
  body: eventBodyAaveBasicBuySchema,
  triggers: z.custom<GetTriggersResponse>(),
})

const errorsValidation = paramsSchema
  .refine(
    ({ position }) => {
      return position.ltv >= MINIMUM_LTV_TO_SETUP_TRIGGER
    },
    {
      message: 'LTV is too low to setup auto buy',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.TooLowLtvToSetupAutoBuy,
      },
    },
  )
  .refine(
    ({ body }) => {
      if (body.triggerData.useMaxBuyPrice) {
        return body.triggerData.maxBuyPrice !== undefined
      }
      return true
    },
    {
      message: 'Max buy price is not set',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.MaxBuyPriceIsNotSet,
      },
    },
  )
  .refine(
    ({ executionPrice, body }) => {
      return body.triggerData.maxBuyPrice && body.triggerData.maxBuyPrice > executionPrice
    },
    {
      message: 'Execution price is bigger than max buy price',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.ExecutionPriceBiggerThanMaxBuyPrice,
      },
      path: ['triggerData', 'maxBuyPrice'],
    },
  )
  .refine(
    ({ body }) => {
      return body.triggerData.executionLTV < body.triggerData.targetLTV
    },
    {
      message: 'Execution LTV is smaller than target LTV',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.ExecutionLTVSmallerThanTargetLTV,
      },
    },
  )
  .refine(
    ({ position, body }) => {
      return body.triggerData.executionLTV <= position.ltv - ONE_PERCENT
    },
    {
      message: 'Execution LTV is bigger than current LTV',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.ExecutionLTVBiggerThanCurrentLTV,
      },
    },
  )
  .refine(
    ({ triggers, body }) => {
      const autoSellTrigger = triggers.triggers.aaveBasicSell
      if (!autoSellTrigger) {
        return true
      }

      const autoSellTargetLTV = safeParseBigInt(autoSellTrigger.decodedParams.targetLtv) ?? 0n

      return autoSellTargetLTV < body.triggerData.executionLTV
    },
    {
      message: 'Auto buy trigger lower than auto sell target',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.AutoBuyTriggerLowerThanAutoSellTarget,
      },
    },
  )

const warningsValidation = paramsSchema
  .refine(
    ({ body, position }) => {
      return position.ltv > body.triggerData.executionLTV
    },
    {
      message: 'Auto buy triggered immediately',
      params: {
        code: AutoBuyTriggerCustomWarningCodes.AutoBuyTriggeredImmediately,
      },
    },
  )
  .refine(
    ({ body, triggers }) => {
      const autoSellTrigger = triggers.triggers.aaveBasicSell
      if (!autoSellTrigger) {
        return true
      }

      const autoSellTriggerLTV = safeParseBigInt(autoSellTrigger.decodedParams.executionLtv) ?? 0n

      return autoSellTriggerLTV > body.triggerData.executionLTV
    },
    {
      message: 'Auto buy target close to auto sell trigger',
      params: {
        code: AutoBuyTriggerCustomWarningCodes.AutoBuyTargetCloseToAutoSellTrigger,
      },
    },
  )
  .refine(
    ({ body, triggers }) => {
      const stopLossTrigger = triggers.triggers.aaveStopLossToCollateral
      if (!stopLossTrigger) {
        return true
      }

      const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.ltv) ?? 0n

      return stopLossTriggerLTV > body.triggerData.executionLTV
    },
    {
      message: 'Auto buy target close to stop loss trigger',
      params: {
        code: AutoBuyTriggerCustomWarningCodes.AutoBuyTriggerCloseToStopLossTrigger,
      },
    },
  )
  .refine(
    ({ body, triggers }) => {
      const stopLossTrigger = triggers.triggers.aaveStopLossToDebt
      if (!stopLossTrigger) {
        return true
      }

      const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.ltv) ?? 0n

      return stopLossTriggerLTV > body.triggerData.executionLTV
    },
    {
      message: 'Auto buy target close to stop loss trigger',
      params: {
        code: AutoBuyTriggerCustomWarningCodes.AutoBuyTriggerCloseToStopLossTrigger,
      },
    },
  )
  .refine(
    ({ body }) => {
      return body.triggerData.maxBuyPrice !== undefined
    },
    {
      message: 'Auto buy with no max price threshold',
      params: {
        code: AutoBuyTriggerCustomWarningCodes.AutoBuyWithNoMaxPriceThreshold,
      },
    },
  )

export const autoBuyValidator: AgainstPositionValidator<AaveAutoBuyTriggerData> = (params) => {
  const errorValidation = errorsValidation.safeParse(params)

  if (errorValidation.success) {
    const warningValidation = warningsValidation.safeParse(params)
    if (warningValidation.success) {
      return {
        success: true,
        errors: [],
        warnings: [],
      }
    }

    return mapZodResultToValidationResults({ warnings: warningValidation.error.errors })
  }

  return mapZodResultToValidationResults({ errors: errorValidation.error.errors })
}
