import {
  DmaStopLossTriggerData,
  dmaStopLossTriggerDataSchema,
  mapZodResultToValidationResults,
  positionSchema,
  priceSchema,
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
// .refine(
//   ({ position }) => {
//     return position.ltv > MINIMUM_LTV_TO_SETUP_TRIGGER
//   },
//   {
//     message: 'LTV is too low to setup auto sell',
//     params: {
//       code: AutoSellTriggerCustomErrorCodes.TooLowLtvToSetupAutoSell,
//     },
//   },
// )
// .refine(
//   ({ position, triggerData }) => {
//     return position.ltv < triggerData.executionLTV
//   },
//   {
//     message: 'Execution LTV is bigger than current LTV',
//     params: {
//       code: AutoSellTriggerCustomErrorCodes.ExecutionLTVLowerThanCurrentLTV,
//     },
//   },
// )

const deleteErrorsValidation = paramsSchema
// .refine(
//   ({ triggers, action }) => {
//     if (action === SupportedActions.Remove) return triggers.triggers.aaveBasicSell !== undefined
//     return true
//   },
//   {
//     message: 'Auto sell trigger does not exist',
//     params: {
//       code: AutoSellTriggerCustomErrorCodes.AutoSellTriggerDoesNotExist,
//     },
//   },
// )

const warningsValidation = paramsSchema
// .refine(
//   ({ triggerData, position }) => {
//     return position.ltv < triggerData.executionLTV
//   },
//   {
//     message: 'Auto sell triggered immediately',
//     params: {
//       code: AutoSellTriggerCustomWarningCodes.AutoSellTriggeredImmediately,
//     },
//     path: ['triggerData', 'executionLTV'],
//   },
// )
// .refine(
//   ({ triggerData, triggers }) => {
//     const autoBuyTrigger = triggers.triggers.aaveBasicBuy
//     if (!autoBuyTrigger) {
//       return true
//     }

//     const autoBuyTriggerLTV = safeParseBigInt(autoBuyTrigger.decodedParams.executionLtv) ?? 0n

//     return autoBuyTriggerLTV < triggerData.executionLTV
//   },
//   {
//     message: 'Auto sell target close to auto buy trigger',
//     params: {
//       code: AutoSellTriggerCustomWarningCodes.AutoSellTargetCloseToAutoBuyTrigger,
//     },
//     path: ['triggerData', 'executionLTV'],
//   },
// )
// .refine(
//   ({ triggerData, triggers }) => {
//     const stopLossTrigger = triggers.triggers.aaveStopLossToCollateral
//     if (!stopLossTrigger) {
//       return true
//     }

//     const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.ltv) ?? 0n

//     return stopLossTriggerLTV < triggerData.executionLTV
//   },
//   {
//     message: 'Auto sell trigger close to stop loss trigger',
//     params: {
//       code: AutoSellTriggerCustomWarningCodes.AutoSellTriggerCloseToStopLossTrigger,
//     },
//     path: ['triggerData', 'executionLTV'],
//   },
// )
// .refine(
//   ({ triggerData, triggers }) => {
//     const stopLossTrigger = triggers.triggers.aaveStopLossToDebt
//     if (!stopLossTrigger) {
//       return true
//     }

//     const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.ltv) ?? 0n

//     return stopLossTriggerLTV < triggerData.executionLTV
//   },
//   {
//     message: 'Auto sell trigger close to stop loss trigger',
//     params: {
//       code: AutoSellTriggerCustomWarningCodes.AutoSellTriggerCloseToStopLossTrigger,
//     },
//     path: ['triggerData', 'executionLTV'],
//   },
// )

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
