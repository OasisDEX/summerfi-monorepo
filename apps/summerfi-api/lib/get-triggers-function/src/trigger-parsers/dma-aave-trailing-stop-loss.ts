import { DmaAaveTrailingStopLoss } from '@summerfi/serverless-contracts/get-triggers-response'
import { PricesSubgraphClient } from '@summerfi/prices-subgraph'
import { TriggersQuery } from '@summerfi/automation-subgraph'
import { safeParseBigInt } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { mapTriggerCommonParams } from '../helpers'

export const getDmaAaveTrailingStopLoss = async ({
  triggers,
  pricesSubgraphClient,
  logger,
}: {
  triggers: TriggersQuery
  pricesSubgraphClient: PricesSubgraphClient
  logger: Logger
}): Promise<DmaAaveTrailingStopLoss | undefined> => {
  const trigger = triggers.triggers.find(
    (trigger) => trigger.triggerType == DmaAaveTrailingStopLoss,
  )
  if (!trigger) {
    return undefined
  }
  const token = trigger.decodedData[
    trigger.decodedDataNames.indexOf('collateralToken')
  ] as `0x${string}`
  const denomination = trigger.decodedData[
    trigger.decodedDataNames.indexOf('debtToken')
  ] as `0x${string}`
  const creationTimestamp = trigger.addedTimestamp

  const maxPriceResponse = await pricesSubgraphClient.getMaxPrice({
    token,
    denomination,
    from: creationTimestamp,
  })

  const trailingDistance =
    safeParseBigInt(trigger.decodedData[trigger.decodedDataNames.indexOf('trailingDistance')]) ?? 0n
  const maxPrice = safeParseBigInt(maxPriceResponse?.derivedPrice.toString()) ?? 0n

  if (!maxPrice) {
    logger.warn('Max price not found for', { token, denomination, creationTimestamp })
  }

  const dynamicParams = {
    executionPrice: maxPrice - trailingDistance,
  }

  return {
    triggerTypeName: 'DmaAaveTrailingStopLoss' as const,
    triggerType: DmaAaveTrailingStopLoss,
    ...mapTriggerCommonParams(trigger),
    decodedParams: {
      triggerType: trigger.decodedData[trigger.decodedDataNames.indexOf('triggerType')],
      positionAddress: trigger.decodedData[trigger.decodedDataNames.indexOf('positionAddress')],
      maxCoverage: trigger.decodedData[trigger.decodedDataNames.indexOf('maxCoverage')],
      debtToken: trigger.decodedData[trigger.decodedDataNames.indexOf('debtToken')],
      collateralToken: trigger.decodedData[trigger.decodedDataNames.indexOf('collateralToken')],
      operationName: trigger.decodedData[trigger.decodedDataNames.indexOf('operationName')],
      collateralOracle: trigger.decodedData[trigger.decodedDataNames.indexOf('collateralOracle')],
      collateralAddedRoundId:
        trigger.decodedData[trigger.decodedDataNames.indexOf('collateralAddedRoundId')],
      debtOracle: trigger.decodedData[trigger.decodedDataNames.indexOf('debtOracle')],
      debtAddedRoundId: trigger.decodedData[trigger.decodedDataNames.indexOf('debtAddedRoundId')],
      trailingDistance: trigger.decodedData[trigger.decodedDataNames.indexOf('trailingDistance')],
      closeToCollateral: trigger.decodedData[trigger.decodedDataNames.indexOf('closeToCollateral')],
    },
    dynamicParams: {
      executionPrice: dynamicParams.executionPrice?.toString(),
    },
  }
}
