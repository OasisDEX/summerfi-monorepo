import {
  DmaStopLossTriggerData,
  dmaStopLossTriggerDataSchema,
  mapZodResultToValidationResults,
  positionSchema,
  priceSchema,
  StopLossErrorCodes,
  SupportedActions,
  supportedActionsSchema,
  ValidationResults,
} from '~types'
import { z } from 'zod'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { AgainstPositionValidator } from './validators-types'

const paramsSchema = z.object({
  position: positionSchema,
  executionPrice: priceSchema,
  triggerData: dmaStopLossTriggerDataSchema,
  triggers: z.custom<GetTriggersResponse>(),
  action: supportedActionsSchema,
})

const upsertErrorsValidation = paramsSchema
  .refine(
    ({ triggers, action }) => {
      if (action === SupportedActions.Add) {
        const currentTrigger =
          triggers.triggers.aaveStopLossToCollateral ??
          triggers.triggers.aaveStopLossToDebt ??
          triggers.triggers.aaveStopLossToCollateralDMA ??
          triggers.triggers.aaveStopLossToDebtDMA
        return currentTrigger === undefined
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
        const currentTrigger =
          triggers.triggers.aaveStopLossToCollateral ??
          triggers.triggers.aaveStopLossToDebt ??
          triggers.triggers.aaveStopLossToCollateralDMA ??
          triggers.triggers.aaveStopLossToDebtDMA

        return currentTrigger !== undefined
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

const deleteErrorsValidation = paramsSchema.refine(
  ({ triggers, action }) => {
    if (action === SupportedActions.Remove) {
      const currentTrigger =
        triggers.triggers.aaveStopLossToCollateral ??
        triggers.triggers.aaveStopLossToDebt ??
        triggers.triggers.aaveStopLossToCollateralDMA ??
        triggers.triggers.aaveStopLossToDebtDMA

      return currentTrigger !== undefined
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

const warningsValidation = paramsSchema.refine(
  ({ triggerData, position }) => {
    return position.ltv < triggerData.executionLTV
  },
  {
    message: 'Stop loss triggered immediately',
    params: {
      code: StopLossErrorCodes.StopLossTriggeredImmediately,
    },
  },
)

export const stopLossValidator: AgainstPositionValidator<DmaStopLossTriggerData> = (
  params,
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
