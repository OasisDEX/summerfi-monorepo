import { z } from 'zod'
import { AutoBuyTriggerCustomErrorCodes } from '~types'
import {
  maxGasFeeSchema,
  maxUnit256,
  poolIdSchema,
  positionAddressesSchema,
  priceSchema,
  supportedActionsSchema,
} from '@summerfi/triggers-shared'
import { addressSchema, ltvSchema, urlOptionalSchema } from '@summerfi/serverless-shared'

export const morphoBlueBasicBuyTriggerDataSchema = z
  .object({
    type: z
      .any()
      .optional()
      .transform(() => BigInt(111111)),
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

export const eventBodyMorphoBlueBasicBuySchema = z.object({
  dpm: addressSchema,
  poolId: poolIdSchema,
  triggerData: morphoBlueBasicBuyTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
