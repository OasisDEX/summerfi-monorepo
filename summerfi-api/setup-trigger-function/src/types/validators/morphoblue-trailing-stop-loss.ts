import { z } from 'zod'
import { addressSchema, poolIdSchema, urlOptionalSchema } from '@summerfi/serverless-shared'
import {
  positionAddressesSchema,
  priceSchema,
  supportedActionsSchema,
} from '@summerfi/triggers-shared'
import { TriggerType } from '@oasisdex/automation'

export const dmaMorphoBlueTrailingStopLossTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(TriggerType.DmaMorphoBlueTrailingStopLossV2)),
  trailingDistance: priceSchema,
  token: addressSchema,
})
export const eventBodyDmaMorphoBlueTrailingStopLossSchema = z.object({
  dpm: addressSchema,
  poolId: poolIdSchema,
  triggerData: dmaMorphoBlueTrailingStopLossTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
