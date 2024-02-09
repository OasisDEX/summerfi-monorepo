import type { TriggersQuery } from '@summerfi/automation-subgraph/dist/types/graphql/generated'

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
