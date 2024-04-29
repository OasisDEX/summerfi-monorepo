import { z } from 'zod'
import { AutoSellTriggerCustomErrorCodes } from '~types'
import {
  maxGasFeeSchema,
  poolIdSchema,
  positionAddressesSchema,
  priceSchema,
  supportedActionsSchema,
} from '@summerfi/triggers-shared'
import { addressSchema, ltvSchema, urlOptionalSchema } from '@summerfi/serverless-shared'

export const morphoBlueBasicSellTriggerDataSchema = z
  .object({
    type: z
      .any()
      .optional()
      .transform(() => BigInt(111111)),
    executionLTV: ltvSchema,
    targetLTV: ltvSchema,
    minSellPrice: priceSchema.optional().default(0n),
    useMinSellPrice: z.boolean().optional().default(true),
    maxBaseFee: maxGasFeeSchema,
  })
  .refine(
    ({ minSellPrice, useMinSellPrice }) => {
      return useMinSellPrice ? minSellPrice !== 0n && minSellPrice !== undefined : true
    },
    {
      params: {
        code: AutoSellTriggerCustomErrorCodes.MinSellPriceIsNotSet,
      },
      message:
        'Min sell price is not set. Please set min sell price or explicitly disable it in trigger data',
      path: ['triggerData', 'minSellPrice'],
    },
  )

export const eventBodyMorphoBlueBasicSellSchema = z.object({
  dpm: addressSchema,
  poolId: poolIdSchema,
  triggerData: morphoBlueBasicSellTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
