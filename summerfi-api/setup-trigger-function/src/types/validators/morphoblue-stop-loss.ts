import { z } from 'zod'
import {
  addressSchema,
  ltvSchema,
  poolIdSchema,
  urlOptionalSchema,
} from '@summerfi/serverless-shared'
import { positionAddressesSchema, supportedActionsSchema } from '@summerfi/triggers-shared'
import { TriggerType } from '@oasisdex/automation'

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
    return {
      ...data,
      triggerData: {
        ...data.triggerData,
        type: BigInt(TriggerType.DmaMorphoBlueStopLossV2),
      },
    }
  })
