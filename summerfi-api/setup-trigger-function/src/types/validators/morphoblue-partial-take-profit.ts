import { z } from 'zod'
import {
  positionAddressesSchema,
  priceSchema,
  supportedActionsSchema,
} from '@summerfi/triggers-shared'
import {
  addressSchema,
  ltvSchema,
  percentageSchema,
  urlOptionalSchema,
} from '@summerfi/serverless-shared'
import { dmaMorphoBlueStopLossTriggerDataSchema } from './morphoblue-stop-loss'

export const morphoBluePartialTakeProfitTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(111111)),
  withdrawToken: addressSchema,
  executionLTV: ltvSchema,
  withdrawStep: percentageSchema,
  executionPrice: priceSchema,
  stopLoss: z
    .object({
      triggerData: dmaMorphoBlueStopLossTriggerDataSchema,
      action: supportedActionsSchema,
    })
    .optional(),
})

export const eventBodyMorphoBluePartialTakeProfitSchema = z.object({
  dpm: addressSchema,
  triggerData: morphoBluePartialTakeProfitTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
