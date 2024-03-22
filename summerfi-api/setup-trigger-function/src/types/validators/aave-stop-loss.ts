import { z } from 'zod'
import { TriggerType } from '@oasisdex/automation'
import { addressSchema, urlOptionalSchema } from '@summerfi/serverless-shared'
import {
  ltvSchema,
  positionAddressesSchema,
  supportedActionsSchema,
} from '@summerfi/triggers-shared'

export const dmaAaveStopLossToCollateralTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(TriggerType.DmaAaveStopLossToCollateralV2)),
  executionLTV: ltvSchema,
  token: addressSchema,
})

export const dmaAaveStopLossToDebtTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(TriggerType.DmaAaveStopLossToDebtV2)),
  executionLTV: ltvSchema,
  token: addressSchema,
})

export const dmaAaveStopLossTriggerDataSchema = dmaAaveStopLossToCollateralTriggerDataSchema.or(
  dmaAaveStopLossToDebtTriggerDataSchema,
)

export const eventBodyDmaAaveStopLossSchema = z
  .object({
    dpm: addressSchema,
    triggerData: dmaAaveStopLossTriggerDataSchema,
    position: positionAddressesSchema,
    rpc: urlOptionalSchema,
    action: supportedActionsSchema,
  })
  .refine(
    (data) => {
      const closeToken = data.triggerData.token
      return [data.position.debt, data.position.collateral].includes(closeToken)
    },
    {
      message: 'Close token must be either collateral or debt',
      path: ['triggerData', 'token'],
    },
  )
  .transform((data) => {
    const closeToken = data.triggerData.token
    const triggerType =
      closeToken === data.position.debt
        ? TriggerType.DmaAaveStopLossToDebtV2
        : TriggerType.DmaAaveStopLossToCollateralV2
    return {
      ...data,
      triggerData: {
        ...data.triggerData,
        type: BigInt(triggerType),
      },
    }
  })
