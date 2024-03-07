import {
  AutoSellTriggerCustomErrorCodes,
  AutoSellTriggerCustomWarningCodes,
  mapZodResultToValidationResults,
  MINIMUM_LTV_TO_SETUP_TRIGGER,
  positionSchema,
  priceSchema,
  sparkBasicSellTriggerDataSchema,
  SupportedActions,
  supportedActionsSchema,
  ValidationResults,
} from '~types'
import { z } from 'zod'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { chainIdSchema, safeParseBigInt } from '@summerfi/serverless-shared'
import { CurrentStopLoss } from '../trigger-encoders'

const paramsSchema = z.object({
  position: positionSchema,
  executionPrice: priceSchema,
  triggerData: sparkBasicSellTriggerDataSchema,
  triggers: z.custom<GetTriggersResponse>(),
  currentStopLoss: z.custom<CurrentStopLoss | undefined>(),
  action: supportedActionsSchema,
  chainId: chainIdSchema,
})

const upsertErrorsValidation = paramsSchema
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
    ({ executionPrice, triggerData }) => {
      return !triggerData.useMinSellPrice || triggerData.minSellPrice < executionPrice
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
    ({ triggerData }) => {
      return triggerData.targetLTV < triggerData.executionLTV
    },
    {
      message: 'Execution LTV is bigger than target LTV',
      params: {
        code: AutoSellTriggerCustomErrorCodes.ExecutionLTVBiggerThanTargetLTV,
      },
    },
  )
  .refine(
    ({ triggers, triggerData }) => {
      const autoBuyTrigger = triggers.triggers.sparkBasicBuy
      if (!autoBuyTrigger) {
        return true
      }

      const autoBuyExecutionLTV = safeParseBigInt(autoBuyTrigger.decodedParams.executionLtv) ?? 0n

      return triggerData.targetLTV > autoBuyExecutionLTV
    },
    {
      message: 'Auto sell target cannot be lower than auto buy trigger',
      params: {
        code: AutoSellTriggerCustomErrorCodes.AutoSellTriggerHigherThanAutoBuyTarget,
      },
      path: ['triggerData', 'executionLTV'],
    },
  )
  .refine(
    ({ triggerData }) => {
      return triggerData.useMinSellPrice ? triggerData.minSellPrice !== 0n : true
    },
    {
      message: 'Min sell price is not set',
      params: {
        code: AutoSellTriggerCustomErrorCodes.MinSellPriceIsNotSet,
      },
      path: ['triggerData', 'minSellPrice'],
    },
  )
  .refine(
    ({ triggers, action }) => {
      if (action === SupportedActions.Add) {
        return triggers.triggers.sparkBasicSell === undefined
      }
      return true
    },
    {
      message: 'Auto sell trigger already exists',
      params: {
        code: AutoSellTriggerCustomErrorCodes.AutoSellTriggerAlreadyExists,
      },
    },
  )
  .refine(
    ({ triggers, action }) => {
      if (action === SupportedActions.Remove || action === SupportedActions.Update)
        return triggers.triggers.sparkBasicBuy !== undefined
      return true
    },
    {
      message: 'Auto sell trigger does not exist',
      params: {
        code: AutoSellTriggerCustomErrorCodes.AutoSellTriggerDoesNotExist,
      },
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const partialTakeProfit = triggers.triggers.sparkPartialTakeProfit
      if (!partialTakeProfit) {
        return true
      }
      const partialTakeProfitExecutionLtv =
        safeParseBigInt(partialTakeProfit.decodedParams.executionLtv) ?? 0n

      return triggerData.targetLTV > partialTakeProfitExecutionLtv
    },
    {
      message: 'Auto sell target cannot be lower than partial take profit trigger',
      params: {
        code: AutoSellTriggerCustomErrorCodes.PartialTakeProfitTriggerHigherThanAutoSellTarget,
      },
      path: ['triggerData', 'targetLTV'],
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const partialTakeProfit = triggers.triggers.sparkPartialTakeProfit
      if (!partialTakeProfit) {
        return true
      }
      const partialTakeProfitTargetLtv =
        safeParseBigInt(partialTakeProfit.decodedParams.targetLtv) ?? 0n

      return triggerData.executionLTV > partialTakeProfitTargetLtv
    },
    {
      message: 'Auto sell trigger LTV cannot be lower than partial take profit target',
      params: {
        code: AutoSellTriggerCustomErrorCodes.PartialTakeProfitTargetHigherThanAutoSellTrigger,
      },
      path: ['triggerData', 'executionLTV'],
    },
  )

const deleteErrorsValidation = paramsSchema.refine(
  ({ triggers, action }) => {
    if (action === SupportedActions.Remove) return triggers.triggers.sparkBasicSell !== undefined
    return true
  },
  {
    message: 'Auto sell trigger does not exist',
    params: {
      code: AutoSellTriggerCustomErrorCodes.AutoSellTriggerDoesNotExist,
    },
  },
)

const warningsValidation = paramsSchema
  .refine(
    ({ triggerData, position }) => {
      return position.ltv <= triggerData.executionLTV
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
    ({ triggerData, triggers }) => {
      const autoBuyTrigger = triggers.triggers.sparkBasicBuy
      if (!autoBuyTrigger) {
        return true
      }

      const autoBuyTriggerLTV = safeParseBigInt(autoBuyTrigger.decodedParams.executionLtv) ?? 0n

      return autoBuyTriggerLTV < triggerData.executionLTV
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
    ({ triggerData, currentStopLoss }) => {
      if (!currentStopLoss) {
        return true
      }

      return currentStopLoss.executionLTV > triggerData.executionLTV
    },
    {
      message: 'Auto sell never triggered with current stop loss',
      params: {
        code: AutoSellTriggerCustomWarningCodes.AutoSellNeverTriggeredWithCurrentStopLoss,
      },
      path: ['triggerData', 'executionLTV'],
    },
  )
  .refine(
    ({ triggerData, currentStopLoss }) => {
      if (!currentStopLoss) {
        return true
      }

      return currentStopLoss.executionLTV < triggerData.executionLTV
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
    ({ triggerData, position }) => {
      return position.hasStablecoinDebt ? triggerData.useMinSellPrice : true
    },
    {
      message: 'No min sell price',
      params: {
        code: AutoSellTriggerCustomWarningCodes.AutoSellWithNoMinPriceThreshold,
      },
      path: ['triggerData', 'minSellPrice'],
    },
  )

export const sparkAutoSellValidator = (params: z.infer<typeof paramsSchema>): ValidationResults => {
  const errorsValidation =
    params.action === SupportedActions.Remove ? deleteErrorsValidation : upsertErrorsValidation
  const errorResult = errorsValidation.safeParse(params)

  if (errorResult.success) {
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

  return mapZodResultToValidationResults({ errors: errorResult.error.errors })
}
