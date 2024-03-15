import {
  mapZodResultToValidationResults,
  AutoBuyTriggerCustomErrorCodes,
  AutoBuyTriggerCustomWarningCodes,
  aaveBasicBuyTriggerDataSchema,
  ValidationResults,
} from '~types'
import {
  positionSchema,
  priceSchema,
  MINIMUM_LTV_TO_SETUP_TRIGGER,
  supportedActionsSchema,
  SupportedActions,
  ONE_PERCENT,
  CurrentStopLoss,
} from '@summerfi/triggers-shared'
import { GetTriggersResponse } from '@summerfi/triggers-shared/contracts'
import { z } from 'zod'
import { chainIdSchema, safeParseBigInt } from '@summerfi/serverless-shared'

const paramsSchema = z.object({
  position: positionSchema,
  executionPrice: priceSchema,
  triggerData: aaveBasicBuyTriggerDataSchema,
  triggers: z.custom<GetTriggersResponse>(),
  currentStopLoss: z.custom<CurrentStopLoss | undefined>(),
  action: supportedActionsSchema,
  chainId: chainIdSchema,
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
      return !triggerData.useMaxBuyPrice || triggerData.maxBuyPrice > executionPrice
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

      const autoSellExecutionLTV =
        safeParseBigInt(autoSellTrigger.decodedParams.executionLtv) ?? 99n

      return triggerData.targetLTV < autoSellExecutionLTV
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
  .refine(
    ({ triggerData, currentStopLoss }) => {
      if (!currentStopLoss) {
        return true
      }

      return currentStopLoss.executionLTV > triggerData.targetLTV
    },
    {
      message: 'Your Auto-Buy will trigger your Stop-Loss',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.StopLossTriggerLowerThanAutoBuy,
      },
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const partialTakeProfit = triggers.triggers.aavePartialTakeProfit
      if (!partialTakeProfit) {
        return true
      }
      if (!triggerData.useMaxBuyPrice) {
        return true
      }

      const partialTakeProfitMinExecutionPrice =
        safeParseBigInt(partialTakeProfit.decodedParams.executionPrice) ?? 0n

      return triggerData.maxBuyPrice > partialTakeProfitMinExecutionPrice
    },
    {
      message: 'Max buy price is lower than partial take profit execution price',
      params: {
        code: AutoBuyTriggerCustomErrorCodes.PartialTakeProfitMinPriceLowerThanAutoBuyMaxPrice,
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
    ({ triggerData, currentStopLoss }) => {
      if (!currentStopLoss) {
        return true
      }

      return currentStopLoss.executionLTV > triggerData.executionLTV
    },
    {
      message: 'Auto buy target close to stop loss trigger',
      params: {
        code: AutoBuyTriggerCustomWarningCodes.AutoBuyTriggerCloseToStopLossTrigger,
      },
    },
  )
  .refine(
    ({ triggerData, currentStopLoss }) => {
      if (!currentStopLoss) {
        return true
      }
      return currentStopLoss.executionLTV > triggerData.executionLTV
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

export const aaveAutoBuyValidator = (params: z.infer<typeof paramsSchema>): ValidationResults => {
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
