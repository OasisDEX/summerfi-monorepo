import {
  dmaSparkStopLossTriggerDataSchema,
  mapZodResultToValidationResults,
  StopLossErrorCodes,
  StopLossWarningCodes,
  ValidationResults,
} from '~types'
import {
  positionSchema,
  priceSchema,
  TWENTY_MILLIONS_DOllARS,
  supportedActionsSchema,
  SupportedActions,
} from '@summerfi/triggers-shared'
import { z } from 'zod'
import { GetTriggersResponse } from '@summerfi/triggers-shared/contracts'
import { ProtocolId, safeParseBigInt } from '@summerfi/serverless-shared'

const paramsSchema = z.object({
  position: positionSchema,
  executionPrice: priceSchema,
  triggerData: dmaSparkStopLossTriggerDataSchema,
  triggers: z.custom<GetTriggersResponse>(),
  action: supportedActionsSchema,
})

const upsertErrorsValidation = paramsSchema
  .refine(
    ({ triggers, action }) => {
      if (action === SupportedActions.Add) {
        return !triggers.flags.isSparkStopLossEnabled
      }
      return true
    },
    {
      message: 'Stop Loss trigger already exists',
      params: {
        code: StopLossErrorCodes.StopLossTriggerAlreadyExists,
      },
    },
  )
  .refine(
    ({ triggers, action }) => {
      if (action === SupportedActions.Update) {
        return triggers.flags.isSparkStopLossEnabled
      }
      return true
    },
    {
      message: 'Stop loss trigger does not exist',
      params: {
        code: StopLossErrorCodes.StopLossTriggerDoesNotExist,
      },
    },
  )
  .refine(
    ({ position }) => {
      return position.debtValueUSD <= TWENTY_MILLIONS_DOllARS
    },
    {
      message: 'Debt value is too high',
      params: {
        code: StopLossErrorCodes.DebtTooHighToSetupStopLoss,
      },
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const currentAutoBuy = triggers.triggers[ProtocolId.SPARK].basicBuy
      if (currentAutoBuy) {
        const currentAutoBuyTarget = safeParseBigInt(currentAutoBuy.decodedParams.targetLtv) ?? 0n
        return triggerData.executionLTV > currentAutoBuyTarget
      }
      return true
    },
    {
      message:
        'Setting your an Stop-Loss trigger at this level could result in it being executed by your Auto-Buy',
      params: {
        code: StopLossErrorCodes.StopLossTriggeredByAutoBuy,
      },
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const currentPartialTakeProfit = triggers.triggers[ProtocolId.SPARK].partialTakeProfit
      if (currentPartialTakeProfit) {
        const currentPartialTakeProfitTarget =
          safeParseBigInt(currentPartialTakeProfit.decodedParams.targetLtv) ?? 0n
        return triggerData.executionLTV > currentPartialTakeProfitTarget
      }
      return true
    },
    {
      message:
        'Setting your an Stop-Loss trigger at this level could result in it being executed by your Partial Take Profit',
      params: {
        code: StopLossErrorCodes.PartialTakeProfitTargetHigherThanStopLoss,
      },
    },
  )

const deleteErrorsValidation = paramsSchema.refine(
  ({ triggers, action }) => {
    if (action === SupportedActions.Remove) {
      return triggers.flags.isSparkStopLossEnabled
    }
    return true
  },
  {
    message: 'Stop loss trigger does not exist',
    params: {
      code: StopLossErrorCodes.StopLossTriggerDoesNotExist,
    },
  },
)

const warningsValidation = paramsSchema
  .refine(
    ({ triggerData, position }) => {
      return position.ltv < triggerData.executionLTV
    },
    {
      message: 'Stop loss triggered immediately',
      params: {
        code: StopLossWarningCodes.StopLossTriggeredImmediately,
      },
    },
  )
  .refine(
    ({ triggerData, triggers }) => {
      const autoSell = triggers.triggers[ProtocolId.SPARK].basicSell
      if (autoSell) {
        const executionLTV = safeParseBigInt(autoSell.decodedParams.executionLtv) ?? 0n
        return triggerData.executionLTV > executionLTV
      }
      return true
    },
    {
      message: 'Your stop loss will make the auto-sell not trigger',
      params: {
        code: StopLossWarningCodes.StopLossMakesAutoSellNotTrigger,
      },
    },
  )

export const dmaSparkStopLossValidator = (
  params: z.infer<typeof paramsSchema>,
): ValidationResults => {
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
