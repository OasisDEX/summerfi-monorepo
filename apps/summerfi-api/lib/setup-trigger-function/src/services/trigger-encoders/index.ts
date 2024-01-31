import { encodeAaveAutoBuy } from './encode-aave-auto-buy'
import {
  isAaveAutoBuyTriggerData,
  isAaveAutoSellTriggerData,
  isAaveStopLossTriggerData,
  PositionLike,
  safeParseBigInt,
  SupportedTriggers,
  TriggerData,
} from '~types'
import { ProtocolId } from '@summerfi/serverless-shared/domain-types'
import { CurrentTriggerLike, TriggerEncoders, TriggerTransactions } from './types'
import { encodeAaveBasicSell } from './encode-aave-basic-sell'
import { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import { encodeAaveStopLoss } from './encode-aave-stop-loss'

export const triggerEncoders: TriggerEncoders = {
  [ProtocolId.AAVE3]: {
    [SupportedTriggers.AutoBuy]: encodeAaveAutoBuy,
    [SupportedTriggers.AutoSell]: encodeAaveBasicSell,
    [SupportedTriggers.StopLoss]: encodeAaveStopLoss,
  },
}

export const getTriggerEncoder = (params: {
  position: PositionLike
  protocol: ProtocolId
  triggers: GetTriggersResponse
  triggerData: TriggerData
}): TriggerTransactions => {
  const { position, triggers, triggerData } = params
  if (isAaveAutoBuyTriggerData(triggerData)) {
    const currentAutoBuy = triggers.triggers.aaveBasicBuy
    const currentTrigger: CurrentTriggerLike | undefined = currentAutoBuy
      ? {
          triggerData: currentAutoBuy.triggerData as `0x${string}`,
          id: safeParseBigInt(currentAutoBuy.triggerId) ?? 0n,
        }
      : undefined
    return triggerEncoders[ProtocolId.AAVE3][SupportedTriggers.AutoBuy](
      position,
      triggerData,
      currentTrigger,
    )
  }

  if (isAaveAutoSellTriggerData(triggerData)) {
    const currentAutoSell = triggers.triggers.aaveBasicSell
    const currentTrigger: CurrentTriggerLike | undefined = currentAutoSell
      ? {
          triggerData: currentAutoSell.triggerData as `0x${string}`,
          id: safeParseBigInt(currentAutoSell.triggerId) ?? 0n,
        }
      : undefined
    return triggerEncoders[ProtocolId.AAVE3][SupportedTriggers.AutoSell](
      position,
      triggerData,
      currentTrigger,
    )
  }
  if (isAaveStopLossTriggerData(triggerData)) {
    const currentAutoSell = triggers.triggers.aaveBasicSell
    const currentTrigger: CurrentTriggerLike | undefined = currentAutoSell
      ? {
          triggerData: currentAutoSell.triggerData as `0x${string}`,
          id: safeParseBigInt(currentAutoSell.triggerId) ?? 0n,
        }
      : undefined
    return triggerEncoders[ProtocolId.AAVE3][SupportedTriggers.StopLoss](
      position,
      triggerData,
      currentTrigger,
    )
  }

  throw new Error('Unsupported trigger data')
}
