import { z } from 'zod'
import { TriggerType } from '@oasisdex/automation'
import { AutoSellTriggerCustomErrorCodes } from '~types'
import {
  ltvSchema,
  maxGasFeeSchema,
  positionAddressesSchema,
  priceSchema,
  supportedActionsSchema,
} from './common'
import { addressSchema, urlOptionalSchema } from '@summerfi/serverless-shared'

export const aaveBasicSellTriggerDataSchema = z
  .object({
    type: z
      .any()
      .optional()
      .transform(() => BigInt(TriggerType.DmaAaveBasicSellV2)),
    executionLTV: ltvSchema,
    targetLTV: ltvSchema,
    minSellPrice: priceSchema.optional().default(0n),
    useMinSellPrice: z.boolean().optional().default(true),
    maxBaseFee: maxGasFeeSchema,
  })
  .refine(
    ({ minSellPrice, useMinSellPrice }) => {
      return useMinSellPrice ? minSellPrice !== 0n : true
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

export const eventBodyAaveBasicSellSchema = z.object({
  dpm: addressSchema,
  triggerData: aaveBasicSellTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
