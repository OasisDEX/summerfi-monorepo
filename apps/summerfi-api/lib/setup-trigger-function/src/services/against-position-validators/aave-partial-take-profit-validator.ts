import {
  positionSchema,
  mapZodResultToValidationResults,
  supportedActionsSchema,
  SupportedActions,
  ValidationResults,
  aavePartialTakeProfitTriggerDataSchema,
  CommonErrorCodes,
} from '~types'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { z } from 'zod'
import { chainIdSchema } from '@summerfi/serverless-shared'

const paramsSchema = z.object({
  position: positionSchema,
  triggerData: aavePartialTakeProfitTriggerDataSchema,
  triggers: z.custom<GetTriggersResponse>(),
  action: supportedActionsSchema,
  chainId: chainIdSchema,
})

const upsertErrorsValidation = paramsSchema
  .refine(
    ({ triggers, action }) => {
      if (action === SupportedActions.Add) {
        return triggers.triggers.aavePartialTakeProfit === undefined
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
        return triggers.triggers.aavePartialTakeProfit !== undefined
      return true
    },
    {
      message: 'Trigger does not exist',
      params: {
        code: CommonErrorCodes.TriggerDoesNotExist,
      },
    },
  )

const deleteErrorsValidation = paramsSchema.refine(
  ({ triggers, action }) => {
    if (action === SupportedActions.Remove)
      return triggers.triggers.aavePartialTakeProfit !== undefined
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
