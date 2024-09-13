import { TriggersQuery } from '@summerfi/automation-subgraph'
import {
  MakerBasicBuy,
  MakerBasicSell,
  MakerConstantMultiple,
} from '@summerfi/triggers-shared/contracts'

export const getMakerConstantMultiple = ({
  makerBasicBuy,
  makerBasicSell,
  trigger,
}: {
  makerBasicBuy: MakerBasicBuy
  makerBasicSell: MakerBasicSell
  trigger: TriggersQuery['triggers'][0]
}) =>
  ({
    triggerTypeName: 'MakerConstantMultiple',
    triggerType: null,
    triggerGroupId: trigger.triggerGroupId,
    decodedParams: {
      cdpId: trigger.cdp!.id,
      basicBuyExecutionLtv: makerBasicBuy.decodedParams.executionLtv,
      basicSellExecutionLtv: makerBasicSell.decodedParams.executionLtv,
      basicBuyTargetLtv: makerBasicBuy.decodedParams.targetLtv,
      basicSellTargetLtv: makerBasicSell.decodedParams.targetLtv,
      basicBuyMaxBuyprice: makerBasicBuy.decodedParams.maxBuyPrice,
      basicSellMinSellprice: makerBasicSell.decodedParams.minSellPrice,
      continuous: makerBasicBuy.decodedParams.continuous,
      deviation: makerBasicBuy.decodedParams.deviation,
      maxBaseFeeInGwei: makerBasicBuy.decodedParams.maxBaseFeeInGwei,
    },
  }) as MakerConstantMultiple
