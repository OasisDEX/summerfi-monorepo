import type { TriggersQuery } from '@summerfi/automation-subgraph'
import { getTriggerPoolId } from './get-trigger-pool-id'

export const mapTriggerCommonParams = (trigger: TriggersQuery['triggers'][number]) => ({
  triggerId: trigger.id,
  triggerData: trigger.triggerData,
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

  return poolIdFromTrigger.toLowerCase() === poolId.toLowerCase()
}
