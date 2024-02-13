import { z } from 'zod'
import { TriggerType } from '@oasisdex/automation'
import { addressSchema, urlOptionalSchema } from '@summerfi/serverless-shared'
import { ltvSchema, positionAddressesSchema, supportedActionsSchema } from './common'

export const dmaSparkStopLossToCollateralTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(TriggerType.DmaSparkStopLossToCollateralV2)),
  executionLTV: ltvSchema,
  token: addressSchema,
})

export const dmaSparkStopLossToDebtTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(TriggerType.DmaSparkStopLossToDebtV2)),
  executionLTV: ltvSchema,
  token: addressSchema,
})

export const dmaSparkStopLossTriggerDataSchema = dmaSparkStopLossToCollateralTriggerDataSchema.or(
  dmaSparkStopLossToDebtTriggerDataSchema,
)

export const eventBodyDmaSparkStopLossSchema = z
  .object({
    dpm: addressSchema,
    triggerData: dmaSparkStopLossTriggerDataSchema,
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
        ? TriggerType.DmaSparkStopLossToDebtV2
        : TriggerType.DmaSparkStopLossToCollateralV2
    return {
      ...data,
      triggerData: {
        ...data.triggerData,
        type: BigInt(triggerType),
      },
    }
  })
