import { z } from 'zod'
import { addressSchema, ltvSchema, urlOptionalSchema } from '@summerfi/serverless-shared'
import {
  poolIdSchema,
  positionAddressesSchema,
  supportedActionsSchema,
} from '@summerfi/triggers-shared'

export const dmaMorphoBlueStopLossToCollateralTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(111111)),
  executionLTV: ltvSchema,
  token: addressSchema,
})

export const dmaMorphoBlueStopLossToDebtTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(111111)),
  executionLTV: ltvSchema,
  token: addressSchema,
})

export const dmaMorphoBlueStopLossTriggerDataSchema =
  dmaMorphoBlueStopLossToCollateralTriggerDataSchema.or(
    dmaMorphoBlueStopLossToDebtTriggerDataSchema,
  )

export const eventBodyDmaMorphoBlueStopLossSchema = z
  .object({
    dpm: addressSchema,
    poolId: poolIdSchema,
    triggerData: dmaMorphoBlueStopLossTriggerDataSchema,
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
    const triggerType = closeToken === data.position.debt ? 111111 : 1111112
    return {
      ...data,
      triggerData: {
        ...data.triggerData,
        type: BigInt(triggerType),
      },
    }
  })
