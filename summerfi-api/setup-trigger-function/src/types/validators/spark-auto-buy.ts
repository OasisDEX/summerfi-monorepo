import { z } from 'zod'
import { TriggerType } from '@oasisdex/automation'
import { AutoBuyTriggerCustomErrorCodes } from '~types'
import {
  maxGasFeeSchema,
  maxUnit256,
  positionAddressesSchema,
  priceSchema,
  supportedActionsSchema,
} from '@summerfi/triggers-shared'
import { addressSchema, ltvSchema, urlOptionalSchema } from '@summerfi/serverless-shared'

export const sparkBasicBuyTriggerDataSchema = z
  .object({
    type: z
      .any()
      .optional()
      .transform(() => BigInt(TriggerType.DmaSparkBasicBuyV2)),
    executionLTV: ltvSchema,
    targetLTV: ltvSchema,
    maxBuyPrice: priceSchema.optional().default(maxUnit256),
    useMaxBuyPrice: z.boolean().optional().default(true),
    maxBaseFee: maxGasFeeSchema,
  })
  .refine(
    ({ maxBuyPrice, useMaxBuyPrice }) => {
      return useMaxBuyPrice ? maxBuyPrice !== maxUnit256 && maxBuyPrice !== undefined : true
    },
    {
      params: {
        code: AutoBuyTriggerCustomErrorCodes.MaxBuyPriceIsNotSet,
      },
      message:
        'Max buy price is not set. Please set max buy price or explicitly disable it in trigger data',
      path: ['triggerData', 'maxBuyPrice'],
    },
  )

export const eventBodySparkBasicBuySchema = z.object({
  dpm: addressSchema,
  triggerData: sparkBasicBuyTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
