import { z } from 'zod'
import { AutoSellTriggerCustomErrorCodes } from '~types'
import {
  maxGasFeeSchema,
  positionAddressesSchema,
  priceSchema,
  supportedActionsSchema,
} from '@summerfi/triggers-shared'
import {
  addressSchema,
  ltvSchema,
  poolIdSchema,
  urlOptionalSchema,
} from '@summerfi/serverless-shared'
import { TriggerType } from '@oasisdex/automation'

export const morphoBlueBasicSellTriggerDataSchema = z
  .object({
    type: z
      .any()
      .optional()
      .transform(() => BigInt(TriggerType.DmaMorphoBlueBasicSellV2)),
    executionLTV: ltvSchema,
    targetLTV: ltvSchema,
    poolId: poolIdSchema,
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
  triggerData: morphoBlueBasicSellTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
