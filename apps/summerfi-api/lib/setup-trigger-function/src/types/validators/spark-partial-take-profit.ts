import { z } from 'zod'
import { TriggerType } from '@oasisdex/automation'
import {
  ltvSchema,
  percentageSchema,
  positionAddressesSchema,
  priceSchema,
  supportedActionsSchema,
} from './common'
import { addressSchema, urlOptionalSchema } from '@summerfi/serverless-shared'
import { dmaSparkStopLossTriggerDataSchema } from './spark-stop-loss'
import { dmaSparkTrailingStopLossTriggerDataSchema } from './spark-trailing-stop-loss'

export const sparkPartialTakeProfitTriggerDataSchema = z
  .object({
    type: z
      .any()
      .optional()
      .transform(() => BigInt(TriggerType.DmaSparkPartialTakeProfitV2)),
    withdrawToken: addressSchema,
    executionLTV: ltvSchema,
    withdrawStep: percentageSchema,
    executionPrice: priceSchema,
    stopLoss: z
      .object({
        triggerData: dmaSparkStopLossTriggerDataSchema,
        action: supportedActionsSchema,
      })
      .optional(),
    trailingStopLoss: z
      .object({
        triggerData: dmaSparkTrailingStopLossTriggerDataSchema,
        action: supportedActionsSchema,
      })
      .optional(),
  })
  .refine(
    ({ stopLoss, trailingStopLoss }) => {
      return !(stopLoss && trailingStopLoss)
    },
    {
      message: 'Spark partial take profit cannot have both stop loss and trailing stop loss',
    },
  )

export const eventBodySparkPartialTakeProfitSchema = z.object({
  dpm: addressSchema,
  triggerData: sparkPartialTakeProfitTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
