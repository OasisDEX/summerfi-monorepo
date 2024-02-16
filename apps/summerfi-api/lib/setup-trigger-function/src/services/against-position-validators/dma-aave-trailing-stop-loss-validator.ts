import {
  dmaAaveTrailingStopLossTriggerDataSchema,
  ltvSchema,
  mapZodResultToValidationResults,
  positionSchema,
  priceSchema,
  safeParseBigInt,
  StopLossErrorCodes,
  StopLossWarningCodes,
  SupportedActions,
  supportedActionsSchema,
  TrailingStopLossErrorCodes,
  TWENTY_MILLIONS_DOllARS,
  ValidationResults,
} from '~types'
import { z } from 'zod'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { LatestPrice } from '@summerfi/prices-subgraph'

const paramsSchema = z.object({
  position: positionSchema,
  executionPrice: priceSchema,
  dynamicExecutionLTV: ltvSchema,
  triggerData: dmaAaveTrailingStopLossTriggerDataSchema,
  triggers: z.custom<GetTriggersResponse>(),
  latestPrice: z.custom<LatestPrice | undefined>(),
  action: supportedActionsSchema,
})
const upsertErrorsValidation = paramsSchema
  .refine(
    ({ triggers, action }) => {
      if (action === SupportedActions.Add) {
        return !triggers.flags.isAaveStopLossEnabled
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
        return triggers.flags.isAaveStopLossEnabled
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
    ({ dynamicExecutionLTV, triggers }) => {
      const currentAutoBuy = triggers.triggers.aaveBasicBuy
      if (currentAutoBuy) {
        const currentAutoBuyTarget = safeParseBigInt(currentAutoBuy.decodedParams.targetLtv) ?? 0n
        return dynamicExecutionLTV > currentAutoBuyTarget
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
    ({ triggers }) => {
      const currentAutoSell = triggers.triggers.aaveBasicSell
      if (currentAutoSell) {
        const minSellPrice = safeParseBigInt(currentAutoSell.decodedParams.minSellPrice) ?? 0n
        return minSellPrice > 0n
      }
      return true
    },
    {
      message: 'Your Auto-Sell will make your stop loss not trigger.',
      params: {
        code: StopLossErrorCodes.StopLossNeverTriggeredWithNoAutoSellMinSellPrice,
      },
    },
  )
  .refine(
    ({ triggers, executionPrice }) => {
      const currentAutoSell = triggers.triggers.aaveBasicSell
      if (currentAutoSell) {
        const minSellPrice = safeParseBigInt(currentAutoSell.decodedParams.minSellPrice) ?? 0n
        return minSellPrice > executionPrice
      }
      return true
    },
    {
      message: 'Your Auto-Sell will make your stop loss not trigger.',
      params: {
        code: StopLossErrorCodes.StopLossNeverTriggeredWithLowerAutoSellMinSellPrice,
      },
    },
  )
  .refine(
    ({ latestPrice }) => {
      return latestPrice !== undefined
    },
    {
      message: 'Latest price is undefined',
      params: {
        code: TrailingStopLossErrorCodes.CantObtainLatestPrice,
      },
    },
  )

const deleteErrorsValidation = paramsSchema.refine(
  ({ triggers, action }) => {
    if (action === SupportedActions.Remove) {
      return triggers.flags.isAaveStopLossEnabled
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
    ({ position, dynamicExecutionLTV }) => {
      return position.ltv < dynamicExecutionLTV
    },
    {
      message: 'Stop loss triggered immediately',
      params: {
        code: StopLossWarningCodes.StopLossTriggeredImmediately,
      },
    },
  )
  .refine(
    ({ dynamicExecutionLTV, triggers }) => {
      const autoSell = triggers.triggers.aaveBasicSell
      if (autoSell) {
        const executionLTV = safeParseBigInt(autoSell.decodedParams.executionLtv) ?? 0n
        return dynamicExecutionLTV > executionLTV
      }
    },
    {
      message: 'Your stop loss will make the auto-sell not trigger',
      params: {
        code: StopLossWarningCodes.StopLossMakesAutoSellNotTrigger,
      },
    },
  )

export const dmaAaveTrailingStopLossValidator = (
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
