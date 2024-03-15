import { z } from 'zod'
import { TriggerType } from '@oasisdex/automation'
import { addressSchema, urlOptionalSchema } from '@summerfi/serverless-shared'
import {
  positionAddressesSchema,
  priceSchema,
  supportedActionsSchema,
} from '@summerfi/triggers-shared'

export const dmaAaveTrailingStopLossTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(TriggerType.DmaAaveTrailingStopLossV2)),
  trailingDistance: priceSchema,
  token: addressSchema,
})
export const eventBodyDmaAaveTrailingStopLossSchema = z.object({
  dpm: addressSchema,
  triggerData: dmaAaveTrailingStopLossTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
