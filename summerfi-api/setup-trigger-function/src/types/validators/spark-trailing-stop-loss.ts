import { z } from 'zod'
import { TriggerType } from '@oasisdex/automation'
import { addressSchema, urlOptionalSchema } from '@summerfi/serverless-shared'
import { positionAddressesSchema, priceSchema, supportedActionsSchema } from './common'

export const dmaSparkTrailingStopLossTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(TriggerType.DmaSparkTrailingStopLossV2)),
  trailingDistance: priceSchema,
  token: addressSchema,
})
export const eventBodyDmaSparkTrailingStopLossSchema = z.object({
  dpm: addressSchema,
  triggerData: dmaSparkTrailingStopLossTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
