import { z } from 'zod'
import { addressSchema, urlOptionalSchema } from '@summerfi/serverless-shared'
import {
  positionAddressesSchema,
  priceSchema,
  supportedActionsSchema,
} from '@summerfi/triggers-shared'

export const dmaMorphoBlueTrailingStopLossTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(111111)),
  trailingDistance: priceSchema,
  token: addressSchema,
})
export const eventBodyDmaMorphoBlueTrailingStopLossSchema = z.object({
  dpm: addressSchema,
  triggerData: dmaMorphoBlueTrailingStopLossTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
