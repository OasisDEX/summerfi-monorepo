import {
  positionSchema,
  priceSchema,
  mapZodResultToValidationResults,
  AutoBuyTriggerCustomErrorCodes,
  safeParseBigInt,
  AutoBuyTriggerCustomWarningCodes,
  MINIMUM_LTV_TO_SETUP_TRIGGER,
  AaveAutoBuyTriggerData,
  aaveBasicBuyTriggerDataSchema,
  supportedActionsSchema,
  SupportedActions,
  ONE_PERCENT,
} from '~types'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { z } from 'zod'
import { AgainstPositionValidator } from './validators-types'

const paramsSchema = z.object({
  position: positionSchema,
  executionPrice: priceSchema,
  triggerData: aaveBasicBuyTriggerDataSchema,
  triggers: z.custom<GetTriggersResponse>(),
  action: supportedActionsSchema,
})

const upsertErrorsValidation = paramsSchema
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
    ({ triggerData }) => {
      if (triggerData.useMaxBuyPrice) {
        return triggerData.maxBuyPrice !== undefined
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
    ({ executionPrice, triggerData }) => {
      return triggerData.maxBuyPrice && triggerData.maxBuyPrice > executionPrice
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
    ({ triggerData }) => {
      return triggerData.executionLTV < triggerData.targetLTV
    },
    {
      message: 'Execution LTV is smaller than target LTV',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.ExecutionLTVSmallerThanTargetLTV,
      },
    },
  )
  .refine(
    ({ position, triggerData }) => {
      return triggerData.executionLTV <= position.ltv - ONE_PERCENT
    },
    {
      message: 'Execution LTV is bigger than current LTV',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.ExecutionLTVBiggerThanCurrentLTV,
      },
    },
  )
  .refine(
    ({ triggers, triggerData }) => {
      const autoSellTrigger = triggers.triggers.aaveBasicSell
      if (!autoSellTrigger) {
        return true
      }

      const autosellTargetLTV = safeParseBigInt(autoSellTrigger.decodedParams.targetLtv) ?? 0n

      return triggerData.executionLTV > autosellTargetLTV
    },
    {
      message: 'Auto buy trigger lower than auto sell target',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.AutoBuyTriggerLowerThanAutoSellTarget,
      },
    },
  )
  .refine(
    ({ triggers, action }) => {
      if (action === SupportedActions.Add) {
        return triggers.triggers.aaveBasicBuy === undefined
      }
      return true
    },
    {
      message: 'Auto buy trigger already exists',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.AutoBuyTriggerAlreadyExists,
      },
    },
  )
  .refine(
    ({ triggers, action }) => {
      if (action === SupportedActions.Update) return triggers.triggers.aaveBasicBuy !== undefined
      return true
    },
    {
      message: 'Auto buy trigger does not exist',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.AutoBuyTriggerDoesNotExist,
      },
    },
  )

const deleteErrorsValidation = paramsSchema.refine(
  ({ triggers, action }) => {
    if (action === SupportedActions.Remove) return triggers.triggers.aaveBasicBuy !== undefined
    return true
  },
  {
    message: 'Auto buy trigger does not exist',
    params: {
      code: AutoBuyTriggerCustomErrorCodes.AutoBuyTriggerDoesNotExist,
    },
  },
)

const warningsValidation = paramsSchema
  .refine(
    ({ triggerData, position }) => {
      return position.ltv >= triggerData.executionLTV
    },
    {
      message: 'Auto buy triggered immediately',
      params: {
        code: AutoBuyTriggerCustomWarningCodes.AutoBuyTriggeredImmediately,
      },
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const autoSellTrigger = triggers.triggers.aaveBasicSell
      if (!autoSellTrigger) {
        return true
      }

      const autoSellTriggerLTV = safeParseBigInt(autoSellTrigger.decodedParams.executionLtv) ?? 0n

      return autoSellTriggerLTV > triggerData.executionLTV
    },
    {
      message: 'Auto buy target close to auto sell trigger',
      params: {
        code: AutoBuyTriggerCustomWarningCodes.AutoBuyTargetCloseToAutoSellTrigger,
      },
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const stopLossTrigger = triggers.triggers.aaveStopLossToCollateral
      if (!stopLossTrigger) {
        return true
      }

      const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.ltv) ?? 0n

      return stopLossTriggerLTV > triggerData.executionLTV
    },
    {
      message: 'Auto buy target close to stop loss trigger',
      params: {
        code: AutoBuyTriggerCustomWarningCodes.AutoBuyTriggerCloseToStopLossTrigger,
      },
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const stopLossTrigger = triggers.triggers.aaveStopLossToDebt
      if (!stopLossTrigger) {
        return true
      }

      const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.ltv) ?? 0n

      return stopLossTriggerLTV > triggerData.executionLTV
    },
    {
      message: 'Auto buy target close to stop loss trigger',
      params: {
        code: AutoBuyTriggerCustomWarningCodes.AutoBuyTriggerCloseToStopLossTrigger,
      },
    },
  )
  .refine(
    ({ triggerData, position }) => {
      return position.hasStablecoinDebt ? triggerData.useMaxBuyPrice : true
    },
    {
      message: 'Auto buy with no max price threshold',
      params: {
        code: AutoBuyTriggerCustomWarningCodes.AutoBuyWithNoMaxPriceThreshold,
      },
    },
  )

export const autoBuyValidator: AgainstPositionValidator<AaveAutoBuyTriggerData> = (params) => {
  const errorsValidation =
    params.action === SupportedActions.Remove ? deleteErrorsValidation : upsertErrorsValidation
  const errorValidation = errorsValidation.safeParse(params)

  if (errorValidation.success) {
    const skipWarningsCheck = params.action === SupportedActions.Remove
    const warningValidation = skipWarningsCheck
      ? { success: true, error: { errors: [] } }
      : warningsValidation.safeParse(params)
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
