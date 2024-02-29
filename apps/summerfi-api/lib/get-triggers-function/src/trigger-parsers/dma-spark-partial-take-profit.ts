import {
  DmaSparkPartialTakeProfit,
  DmaSparkPartialTakeProfitID,
} from '@summerfi/serverless-contracts/get-triggers-response'
import { TriggersQuery } from '@summerfi/automation-subgraph'
import { Logger } from '@aws-lambda-powertools/logger'
import { mapTriggerCommonParams } from '../helpers'

export const getDmaSparkPartialTakeProfit = async ({
  triggers,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logger,
}: {
  triggers: TriggersQuery
  logger: Logger
}): Promise<DmaSparkPartialTakeProfit | undefined> => {
  const trigger = triggers.triggers.find(
    (trigger) => trigger.triggerType == DmaSparkPartialTakeProfitID,
  )

  if (!trigger) {
    return undefined
  }

  return {
    triggerTypeName: 'DmaAavePartialTakeProfit' as const,
    triggerType: DmaSparkPartialTakeProfitID,
    ...mapTriggerCommonParams(trigger),
    decodedParams: {
      triggerType: trigger.decodedData[trigger.decodedDataNames.indexOf('triggerType')],
      positionAddress: trigger.decodedData[trigger.decodedDataNames.indexOf('positionAddress')],
      maxCoverage: trigger.decodedData[trigger.decodedDataNames.indexOf('maxCoverage')],
      debtToken: trigger.decodedData[trigger.decodedDataNames.indexOf('debtToken')],
      collateralToken: trigger.decodedData[trigger.decodedDataNames.indexOf('collateralToken')],
      operationName: trigger.decodedData[trigger.decodedDataNames.indexOf('operationName')],
      closeToCollateral: trigger.decodedData[trigger.decodedDataNames.indexOf('closeToCollateral')],
      executionLtv: trigger.decodedData[trigger.decodedDataNames.indexOf('executionLtv')],
      targetLtv: trigger.decodedData[trigger.decodedDataNames.indexOf('targetLtv')],
      deviation: trigger.decodedData[trigger.decodedDataNames.indexOf('deviation')],
      executionPrice: trigger.decodedData[trigger.decodedDataNames.indexOf('executionPrice')],
    },
  }
}
