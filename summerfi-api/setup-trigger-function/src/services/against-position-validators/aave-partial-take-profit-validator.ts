import {
  mapZodResultToValidationResults,
  ValidationResults,
  aavePartialTakeProfitTriggerDataSchema,
  CommonErrorCodes,
  PartialTakeProfitErrorCodes,
} from '~types'
import {
  positionSchema,
  supportedActionsSchema,
  SupportedActions,
  CurrentStopLoss,
} from '@summerfi/triggers-shared'
import { GetTriggersResponse } from '@summerfi/triggers-shared/contracts'
import { z } from 'zod'
import { ProtocolId, chainIdSchema, safeParseBigInt } from '@summerfi/serverless-shared'

const paramsSchema = z.object({
  position: positionSchema,
  triggerData: aavePartialTakeProfitTriggerDataSchema,
  triggers: z.custom<GetTriggersResponse>(),
  action: supportedActionsSchema,
  currentStopLoss: z.custom<CurrentStopLoss | undefined>(),
  chainId: chainIdSchema,
})

const upsertErrorsValidation = paramsSchema
  .refine(
    ({ triggers, action }) => {
      if (action === SupportedActions.Add) {
        return triggers.triggers[ProtocolId.AAVE3].partialTakeProfit === undefined
      }
      return true
    },
    {
      message: 'Trigger already exists',
      params: {
        code: CommonErrorCodes.TriggerAlreadyExists,
      },
    },
  )
  .refine(
    ({ triggers, action }) => {
      if (action === SupportedActions.Remove || action === SupportedActions.Update)
        return triggers.triggers[ProtocolId.AAVE3].partialTakeProfit !== undefined
      return true
    },
    {
      message: 'Trigger does not exist',
      params: {
        code: CommonErrorCodes.TriggerDoesNotExist,
      },
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const autoSell = triggers.triggers[ProtocolId.AAVE3].basicSell
      if (!autoSell) return true

      const autoSellTargetLtv = safeParseBigInt(autoSell.decodedParams.targetLtv) ?? 99n

      return triggerData.executionLTV < autoSellTargetLtv
    },
    {
      message: 'LTV is higher than the LTV of the auto sell trigger',
      params: {
        code: PartialTakeProfitErrorCodes.PartialTakeProfitTriggerHigherThanAutoSellTarget,
      },
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const autoSell = triggers.triggers[ProtocolId.AAVE3].basicSell
      if (!autoSell) return true

      const autoSellExecutionLtv = safeParseBigInt(autoSell.decodedParams.executionLtv) ?? 99n

      return triggerData.executionLTV < autoSellExecutionLtv
    },
    {
      message: 'LTV is higher than the execution LTV of the auto sell trigger',
      params: {
        code: PartialTakeProfitErrorCodes.PartialTakeProfitTargetHigherThanAutoSellTrigger,
      },
    },
  )
  .refine(
    ({ triggerData, currentStopLoss }) => {
      const updatedStopLossData = triggerData.stopLoss?.triggerData.executionLTV

      const getStopLossLtv = updatedStopLossData
        ? updatedStopLossData
        : currentStopLoss?.executionLTV ?? 99_00n

      return triggerData.executionLTV + triggerData.withdrawStep < getStopLossLtv
    },
    {
      message: 'LTV is higher than the stop loss LTV',
      params: {
        code: PartialTakeProfitErrorCodes.PartialTakeProfitTargetHigherThanStopLoss,
      },
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const autoBuy = triggers.triggers[ProtocolId.AAVE3].basicBuy
      if (!autoBuy) return true

      const autoBuyMaxPrice = safeParseBigInt(autoBuy.decodedParams.maxBuyPrice) ?? 0n

      return triggerData.executionPrice > autoBuyMaxPrice
    },
    {
      message: 'Min price is lower than the max price of the auto buy trigger',
      params: {
        code: PartialTakeProfitErrorCodes.PartialTakeProfitMinPriceLowerThanAutoBuyMaxPrice,
      },
    },
  )
  .refine(
    ({ triggerData, position }) => {
      const currentLtv = position.ltv
      return triggerData.executionLTV < currentLtv
    },
    {
      message: 'LTV is higher than the current LTV',
      params: {
        code: PartialTakeProfitErrorCodes.ExecutionLTVBiggerThanCurrentLTV,
      },
    },
  )

const deleteErrorsValidation = paramsSchema.refine(
  ({ triggers, action }) => {
    if (action === SupportedActions.Remove)
      return triggers.triggers[ProtocolId.AAVE3].partialTakeProfit !== undefined
    return true
  },
  {
    message: 'Trigger does not exist',
    params: {
      code: CommonErrorCodes.TriggerDoesNotExist,
    },
  },
)

const warningsValidation = paramsSchema

export const aavePartialTakeProfitValidator = (
  params: z.infer<typeof paramsSchema>,
): ValidationResults => {
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
