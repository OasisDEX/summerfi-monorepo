import {
  AaveAutoSellTriggerData,
  aaveBasicSellTriggerDataSchema,
  AutoSellTriggerCustomErrorCodes,
  AutoSellTriggerCustomWarningCodes,
  mapZodResultToValidationResults,
  MINIMUM_LTV_TO_SETUP_TRIGGER,
  positionSchema,
  priceSchema,
  safeParseBigInt,
  SupportedActions,
  supportedActionsSchema,
  ValidationResults,
} from '~types'
import { z } from 'zod'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { AgainstPositionValidator } from './validators-types'
import { chainIdSchema } from '@summerfi/serverless-shared'

const paramsSchema = z.object({
  position: positionSchema,
  executionPrice: priceSchema,
  triggerData: aaveBasicSellTriggerDataSchema,
  triggers: z.custom<GetTriggersResponse>(),
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
  // .refine(
  //   ({ position, triggerData }) => {
  //     return position.ltv + ONE_PERCENT < triggerData.executionLTV
  //   },
  //   {
  //     message: 'Execution LTV is bigger than current LTV',
  //     params: {
  //       code: AutoSellTriggerCustomErrorCodes.ExecutionLTVLowerThanCurrentLTV,
  //     },
  //   },
  //)
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
      const autoBuyTrigger = triggers.triggers.aaveBasicBuy
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
    ({ triggers, triggerData }) => {
      const stopLossTrigger = triggers.triggers.aaveStopLossToCollateral
      if (!stopLossTrigger) {
        return true
      }

      const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.executionLtv) ?? 0n

      return triggerData.executionLTV < stopLossTriggerLTV
    },
    {
      message: 'Auto sell cannot be defined with current stop loss',
      params: {
        code: AutoSellTriggerCustomErrorCodes.AutoSellNotAvailableDueToTooHighStopLoss,
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
        return triggers.triggers.aaveBasicSell === undefined
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
        return triggers.triggers.aaveBasicSell !== undefined
      return true
    },
    {
      message: 'Auto sell trigger does not exist',
      params: {
        code: AutoSellTriggerCustomErrorCodes.AutoSellTriggerDoesNotExist,
      },
    },
  )
// .refine(
//   ({ position, chainId, action }) => {
//     if (action == SupportedActions.Update) {
//       return true
//     }
//     const minNetValue = minNetValueMap[chainId][ProtocolId.AAVE3]
//     return position.netValueUSD >= minNetValue
//   },
//   {
//     message: 'Net value is too low to setup auto sell',
//     params: {
//       code: AutoSellTriggerCustomErrorCodes.NetValueTooLowToSetupAutoSell,
//     },
//   },
// )

const deleteErrorsValidation = paramsSchema.refine(
  ({ triggers, action }) => {
    if (action === SupportedActions.Remove) return triggers.triggers.aaveBasicSell !== undefined
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
      const autoBuyTrigger = triggers.triggers.aaveBasicBuy
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
    ({ triggerData, triggers }) => {
      const stopLossTrigger = triggers.triggers.aaveStopLossToCollateral
      if (!stopLossTrigger) {
        return true
      }

      const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.executionLtv) ?? 0n

      return stopLossTriggerLTV < triggerData.executionLTV
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
    ({ triggerData, triggers }) => {
      const stopLossTrigger = triggers.triggers.aaveStopLossToDebt
      if (!stopLossTrigger) {
        return true
      }

      const stopLossTriggerLTV = safeParseBigInt(stopLossTrigger.decodedParams.executionLtv) ?? 0n

      return stopLossTriggerLTV < triggerData.executionLTV
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
  .refine(
    ({ triggerData, triggers, position }) => {
      return position.hasStablecoinDebt
        ? !triggerData.useMinSellPrice && triggers.triggers.aaveStopLossToDebt === undefined
        : true
    },
    {
      message: 'No min sell price when stop loss enabled',
      params: {
        code: AutoSellTriggerCustomWarningCodes.NoMinSellPriceWhenStopLoss,
      },
      path: ['triggerData', 'minSellPrice'],
    },
  )

export const autoSellValidator: AgainstPositionValidator<AaveAutoSellTriggerData> = (
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
