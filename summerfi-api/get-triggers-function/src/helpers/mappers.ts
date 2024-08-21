import type { TriggersQuery } from '@summerfi/automation-subgraph'
import { getTriggerPoolId } from './get-trigger-pool-id'

export const mapTriggerCommonParams = (trigger: TriggersQuery['triggers'][number]) => ({
  triggerId: trigger.id,
  triggerData: trigger.triggerData,
})

const mapMakerTriggerCommonParams = ({
  decodedData,
  decodedDataNames,
}: {
  decodedData: readonly string[]
  decodedDataNames: readonly string[]
}) => ({
  cdpId: decodedData[decodedDataNames.indexOf('cdpId')],
  triggerType: decodedData[decodedDataNames.indexOf('triggerType')],
})

const mapMakerBuySellTriggerCommonParams = ({
  decodedData,
  decodedDataNames,
}: {
  decodedData: readonly string[]
  decodedDataNames: readonly string[]
}) => ({
  ...mapMakerTriggerCommonParams({ decodedData, decodedDataNames }),
  execCollRatio: decodedData[decodedDataNames.indexOf('execCollRatio')],
  targetCollRatio: decodedData[decodedDataNames.indexOf('targetCollRatio')],
  continuous: decodedData[decodedDataNames.indexOf('continuous')] === 'true',
  deviation: decodedData[decodedDataNames.indexOf('deviation')],
  maxBaseFeeInGwei: decodedData[decodedDataNames.indexOf('maxBaseFeeInGwei')],
})

export const mapMakerStopLossParams = ({
  decodedData,
  decodedDataNames,
}: TriggersQuery['triggers'][number]) => ({
  ...mapMakerTriggerCommonParams({ decodedData, decodedDataNames }),
  collRatio: decodedData[decodedDataNames.indexOf('collRatio')],
})

export const mapMakerBasicBuyParams = ({
  decodedData,
  decodedDataNames,
}: TriggersQuery['triggers'][number]) => ({
  ...mapMakerBuySellTriggerCommonParams({ decodedData, decodedDataNames }),
  maxBuyPrice: decodedData[decodedDataNames.indexOf('maxBuyPrice')],
})

export const mapMakerBasicSellParams = ({
  decodedData,
  decodedDataNames,
}: TriggersQuery['triggers'][number]) => ({
  ...mapMakerBuySellTriggerCommonParams({ decodedData, decodedDataNames }),
  minSellPrice: decodedData[decodedDataNames.indexOf('minSellPrice')],
})

export const mapMakerAutoTakeProfitParams = ({
  decodedData,
  decodedDataNames,
}: TriggersQuery['triggers'][number]) => ({
  ...mapMakerTriggerCommonParams({ decodedData, decodedDataNames }),
  executionPrice: decodedData[decodedDataNames.indexOf('executionPrice')],
  maxBaseFeeInGwei: decodedData[decodedDataNames.indexOf('maxBaseFeeInGwei')],
})

export const mapStopLossParams = ({
  decodedData,
  decodedDataNames,
}: TriggersQuery['triggers'][number]) => ({
  positionAddress: decodedData[decodedDataNames.indexOf('positionAddress')],
  triggerType: decodedData[decodedDataNames.indexOf('triggerType')],
  maxCoverage: decodedData[decodedDataNames.indexOf('maxCoverage')],
  executionLtv: decodedData[decodedDataNames.indexOf('executionLtv')],
  debtToken: decodedData[decodedDataNames.indexOf('debtToken')],
  collateralToken: decodedData[decodedDataNames.indexOf('collateralToken')],
  ltv: decodedData[decodedDataNames.indexOf('ltv')],
  operationName: decodedData[decodedDataNames.indexOf('operationName')],
})

export const mapBuySellCommonParams = ({
  decodedData,
  decodedDataNames,
}: TriggersQuery['triggers'][number]) => ({
  positionAddress: decodedData[decodedDataNames.indexOf('positionAddress')],
  triggerType: decodedData[decodedDataNames.indexOf('triggerType')],
  maxCoverage: decodedData[decodedDataNames.indexOf('maxCoverage')],
  debtToken: decodedData[decodedDataNames.indexOf('debtToken')],
  collateralToken: decodedData[decodedDataNames.indexOf('collateralToken')],
  operationName: decodedData[decodedDataNames.indexOf('operationName')],
  executionLtv:
    decodedData[
      Math.max(decodedDataNames.indexOf('execLtv'), decodedDataNames.indexOf('executionLtv'))
    ],
  targetLtv: decodedData[decodedDataNames.indexOf('targetLtv')],
  deviation: decodedData[decodedDataNames.indexOf('deviation')],
  maxBaseFeeInGwei: decodedData[decodedDataNames.indexOf('maxBaseFeeInGwei')],
})

export const mapTriggersWithSamePoolId = ({
  poolId,
  trigger,
}: {
  poolId: string
  trigger: TriggersQuery['triggers'][number]
}) => {
  const poolIdFromTrigger = getTriggerPoolId(trigger)

  return poolIdFromTrigger?.toLowerCase() === poolId?.toLowerCase()
}
