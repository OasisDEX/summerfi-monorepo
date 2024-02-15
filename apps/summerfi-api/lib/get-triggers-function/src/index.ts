import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import {
  addressSchema,
  chainIdsSchema,
  urlOptionalSchema,
} from '@summerfi/serverless-shared/validators'

import { getAutomationSubgraphClient } from '@summerfi/automation-subgraph'

import { Logger } from '@aws-lambda-powertools/logger'
import {
  AaveStopLossToCollateral,
  AaveStopLossToCollateralDMA,
  AaveStopLossToCollateralV2ID,
  AaveStopLossToDebt,
  AaveStopLossToDebtDMA,
  AaveStopLossToDebtV2ID,
  DmaAaveBasicBuy,
  DmaAaveBasicBuyV2ID,
  DmaAaveBasicSell,
  DmaAaveBasicSellV2ID,
  DmaAaveStopLossToCollateralV2ID,
  DmaAaveStopLossToDebtV2ID,
  DmaAaveTrailingStopLoss,
  DmaSparkStopLossToCollateralV2ID,
  DmaSparkStopLossToDebtV2ID,
  GetTriggersResponse,
  SparkStopLossToCollateral,
  SparkStopLossToCollateralDMA,
  SparkStopLossToCollateralV2ID,
  SparkStopLossToDebt,
  SparkStopLossToDebtDMA,
  SparkStopLossToDebtV2ID,
} from '@summerfi/serverless-contracts/get-triggers-response'
import {
  mapStopLossParams,
  mapTriggerCommonParams,
  mapBuySellCommonParams,
} from './helpers/mappers'

const logger = new Logger({ serviceName: 'getTriggersFunction' })

const paramsSchema = z.object({
  dpm: addressSchema,
  chainId: chainIdsSchema,
  rpc: urlOptionalSchema,
})

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }

  logger.info(`Query params`, { params: event.queryStringParameters })

  const parseResult = paramsSchema.safeParse(event.queryStringParameters)
  if (!parseResult.success) {
    logger.warn('Incorrect query params', {
      params: event.queryStringParameters,
      errors: parseResult.error.errors,
    })
    return ResponseBadRequest({
      message: 'Validation Errors',
      errors: parseResult.error.errors,
    })
  }
  const params = parseResult.data
  const automationSubgraphClient = getAutomationSubgraphClient({
    urlBase: SUBGRAPH_BASE,
    chainId: params.chainId[0],
    logger,
  })

  const triggers = await automationSubgraphClient.getTriggers(params)

  logger.info(`Got ${triggers.triggers.length} triggers`, {
    triggers: triggers.triggers,
    account: params.dpm,
  })

  const aaveStopLossToCollateral: AaveStopLossToCollateral | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == AaveStopLossToCollateralV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'AaveStopLossToCollateralV2' as const,
        triggerType: AaveStopLossToCollateralV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const aaveStopLossToCollateralDMA: AaveStopLossToCollateralDMA | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaAaveStopLossToCollateralV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaAaveStopLossToCollateralV2' as const,
        triggerType: DmaAaveStopLossToCollateralV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const aaveStopLossToDebt: AaveStopLossToDebt | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == AaveStopLossToDebtV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'AaveStopLossToDebtV2' as const,
        triggerType: AaveStopLossToDebtV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const aaveStopLossToDebtDMA: AaveStopLossToDebtDMA | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaAaveStopLossToDebtV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaAaveStopLossToDebtV2' as const,
        triggerType: DmaAaveStopLossToDebtV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const sparkStopLossToCollateral: SparkStopLossToCollateral | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == SparkStopLossToCollateralV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'SparkStopLossToCollateralV2' as const,
        triggerType: SparkStopLossToCollateralV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const sparkStopLossToCollateralDMA: SparkStopLossToCollateralDMA | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaSparkStopLossToCollateralV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaSparkStopLossToCollateralV2' as const,
        triggerType: DmaSparkStopLossToCollateralV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const sparkStopLossToDebt: SparkStopLossToDebt | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == SparkStopLossToDebtV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'SparkStopLossToDebtV2' as const,
        triggerType: SparkStopLossToDebtV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const sparkStopLossToDebtDMA: SparkStopLossToDebtDMA | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaSparkStopLossToDebtV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaSparkStopLossToDebtV2' as const,
        triggerType: DmaSparkStopLossToDebtV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const aaveBasicBuy: DmaAaveBasicBuy | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaAaveBasicBuyV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaAaveBasicBuyV2' as const,
        triggerType: DmaAaveBasicBuyV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          maxBuyPrice: trigger.decodedData[trigger.decodedDataNames.indexOf('maxBuyPrice')],
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]

  const aaveBasicSell: DmaAaveBasicSell | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaAaveBasicSellV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaAaveBasicSellV2' as const,
        triggerType: DmaAaveBasicSellV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          minSellPrice: trigger.decodedData[trigger.decodedDataNames.indexOf('minSellPrice')],
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]

  const aaveTrailingStopLossDMA: DmaAaveTrailingStopLoss | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaAaveTrailingStopLoss)
    .map((trigger) => {
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
          collateralOracle:
            trigger.decodedData[trigger.decodedDataNames.indexOf('collateralOracle')],
          collateralAddedRoundId:
            trigger.decodedData[trigger.decodedDataNames.indexOf('collateralAddedRoundId')],
          debtOracle: trigger.decodedData[trigger.decodedDataNames.indexOf('debtOracle')],
          debtAddedRoundId:
            trigger.decodedData[trigger.decodedDataNames.indexOf('debtAddedRoundId')],
          trailingDistance:
            trigger.decodedData[trigger.decodedDataNames.indexOf('trailingDistance')],
          closeToCollateral:
            trigger.decodedData[trigger.decodedDataNames.indexOf('closeToCollateral')],
        },
      }
    })[0]

  const response: GetTriggersResponse = {
    triggers: {
      aaveStopLossToCollateral,
      aaveStopLossToCollateralDMA,
      aaveStopLossToDebt,
      aaveStopLossToDebtDMA,
      sparkStopLossToCollateral,
      sparkStopLossToCollateralDMA,
      sparkStopLossToDebt,
      sparkStopLossToDebtDMA,
      aaveBasicBuy,
      aaveBasicSell,
      aaveTrailingStopLossDMA,
    },
    additionalData: {
      params: {
        ...params,
      },
    },
  }

  return ResponseOk({ body: response })
}

export default handler
