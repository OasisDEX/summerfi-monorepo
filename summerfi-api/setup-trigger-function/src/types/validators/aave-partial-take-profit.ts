import { z } from 'zod'
import { TriggerType } from '@oasisdex/automation'
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
import { dmaAaveStopLossTriggerDataSchema } from './aave-stop-loss'

export const aavePartialTakeProfitTriggerDataSchema = z.object({
  type: z
    .any()
    .optional()
    .transform(() => BigInt(TriggerType.DmaAavePartialTakeProfitV2)),
  withdrawToken: addressSchema,
  executionLTV: ltvSchema,
  withdrawStep: percentageSchema,
  executionPrice: priceSchema,
  stopLoss: z
    .object({
      triggerData: dmaAaveStopLossTriggerDataSchema,
      action: supportedActionsSchema,
    })
    .optional(),
})

export const eventBodyAavePartialTakeProfitSchema = z.object({
  dpm: addressSchema,
  triggerData: aavePartialTakeProfitTriggerDataSchema,
  position: positionAddressesSchema,
  rpc: urlOptionalSchema,
  action: supportedActionsSchema,
})
