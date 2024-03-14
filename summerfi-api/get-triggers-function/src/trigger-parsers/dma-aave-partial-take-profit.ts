import {
  DmaAavePartialTakeProfit,
  DmaAavePartialTakeProfitID,
} from '@summerfi/serverless-contracts/get-triggers-response'
import { TriggersQuery } from '@summerfi/automation-subgraph'
import { Logger } from '@aws-lambda-powertools/logger'
import { mapTriggerCommonParams } from '../helpers'
import { PublicClient } from 'viem'
import { getAavePosition, simulateAutoTakeProfit } from '@summerfi/triggers-calculations'
import { Address } from '@summerfi/serverless-shared'

export const getDmaAavePartialTakeProfit = async ({
  triggers,
  logger,
  publicClient,
  getDetails,
}: {
  triggers: TriggersQuery
  logger: Logger
  publicClient: PublicClient
  getDetails: boolean
}): Promise<DmaAavePartialTakeProfit | undefined> => {
  const trigger = triggers.triggers.find(
    (trigger) => trigger.triggerType == DmaAavePartialTakeProfitID,
  )

  if (!trigger) {
    return undefined
  }

  const parsedTrigger = {
    triggerTypeName: 'DmaAavePartialTakeProfit' as const,
    triggerType: DmaAavePartialTakeProfitID,
    ...mapTriggerCommonParams(trigger),
    decodedParams: {
      triggerType: trigger.decodedData[trigger.decodedDataNames.indexOf('triggerType')],
      positionAddress: trigger.decodedData[trigger.decodedDataNames.indexOf('positionAddress')],
      maxCoverage: trigger.decodedData[trigger.decodedDataNames.indexOf('maxCoverage')],
      debtToken: trigger.decodedData[trigger.decodedDataNames.indexOf('debtToken')],
      collateralToken: trigger.decodedData[trigger.decodedDataNames.indexOf('collateralToken')],
      operationName: trigger.decodedData[trigger.decodedDataNames.indexOf('operationName')],
      withdrawToDebt: trigger.decodedData[trigger.decodedDataNames.indexOf('withdrawToDebt')],
      executionLtv: trigger.decodedData[trigger.decodedDataNames.indexOf('executionLtv')],
      targetLtv: trigger.decodedData[trigger.decodedDataNames.indexOf('targetLtv')],
      deviation: trigger.decodedData[trigger.decodedDataNames.indexOf('deviation')],
      executionPrice: trigger.decodedData[trigger.decodedDataNames.indexOf('executionPrice')],
    },
  }

  if (getDetails) {
    const position = await getAavePosition(
      {
        address: parsedTrigger.decodedParams.positionAddress as Address,
        collateral: parsedTrigger.decodedParams.collateralToken as Address,
        debt: parsedTrigger.decodedParams.debtToken as Address,
      },
      publicClient,
      { poolDataProvider: '', oracle: '' },
      logger,
    )

    const simulation = simulateAutoTakeProfit({
      position,
      minimalTriggerData: {
        executionPrice: parsedTrigger.decodedParams.executionPrice,
        executionLTV: parsedTrigger.decodedParams.executionLtv,
        withdrawStep: parsedTrigger.decodedParams.withdrawToDebt,
        withdrawToken: parsedTrigger.decodedParams.debtToken,
      },
      logger: logger,
      iterations: 1,
      currentStopLoss: {
        executionLTV: 0n,
      },
    })
  }

  return parsedTrigger
}
