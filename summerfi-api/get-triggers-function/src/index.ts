import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import {
  addressSchema,
  chainIdSchema,
  optionalPoolIdSchema,
  urlOptionalSchema,
} from '@summerfi/serverless-shared/validators'
import { Chain as ViemChain, createPublicClient, http, PublicClient } from 'viem'
import { arbitrum, base, mainnet, optimism, sepolia } from 'viem/chains'

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
  DmaSparkBasicBuy,
  DmaSparkBasicBuyV2ID,
  DmaSparkBasicSell,
  DmaSparkBasicSellV2ID,
  DmaSparkStopLossToCollateralV2ID,
  DmaSparkStopLossToDebtV2ID,
  GetTriggersResponse,
  LegacyDmaAaveStopLossToCollateralV2ID,
  LegacyDmaAaveStopLossToDebtV2ID,
  LegacyDmaSparkStopLossToCollateralV2ID,
  LegacyDmaSparkStopLossToDebtV2ID,
  MorphoBlueBasicBuy,
  MorphoBlueBasicBuyV2ID,
  MorphoBlueBasicSell,
  MorphoBlueBasicSellV2ID,
  MorphoBlueStopLoss,
  MorphoBlueStopLossV2ID,
  SparkStopLossToCollateral,
  SparkStopLossToCollateralDMA,
  SparkStopLossToCollateralV2ID,
  SparkStopLossToDebt,
  SparkStopLossToDebtDMA,
  SparkStopLossToDebtV2ID,
} from '@summerfi/triggers-shared/contracts'
import {
  getCurrentTrigger,
  getMorphoLambdaPriceConverted,
  hasAnyDefined,
  mapBuySellCommonParams,
  mapStopLossParams,
  mapTriggerCommonParams,
  mapTriggersWithSamePoolId,
} from './helpers'
import { getPricesSubgraphClient } from '@summerfi/prices-subgraph'
import {
  getDmaAavePartialTakeProfit,
  getDmaAaveTrailingStopLoss,
  getDmaMorphoBlueTrailingStopLoss,
  getDmaSparkPartialTakeProfit,
  getDmaSparkTrailingStopLoss,
} from './trigger-parsers'
import { ChainId, getRpcGatewayEndpoint, IRpcConfig, ProtocolId } from '@summerfi/serverless-shared'
import { getAddresses } from '@summerfi/triggers-shared'
import { getMorphoBluePartialTakeProfit } from './trigger-parsers/dma-morphoblue-partial-take-profit'
import { getTokensFromTrigger } from './helpers/get-tokens-from-trigger'

const logger = new Logger({ serviceName: 'get-triggers-function' })

export const rpcConfig: IRpcConfig = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'prod',
  source: 'borrow-prod',
}

const domainChainIdToViemChain: Record<ChainId, ViemChain> = {
  [ChainId.MAINNET]: mainnet,
  [ChainId.ARBITRUM]: arbitrum,
  [ChainId.OPTIMISM]: optimism,
  [ChainId.BASE]: base,
  [ChainId.SEPOLIA]: sepolia,
}

const paramsSchema = z.object({
  dpm: addressSchema,
  poolId: optionalPoolIdSchema,
  chainId: chainIdSchema,
  rpc: urlOptionalSchema,
  getDetails: z
    .boolean()
    .or(z.string().transform((s) => s === 'true'))
    .optional()
    .default(false),
})

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE
  const RPC_GATEWAY = process.env.RPC_GATEWAY

  logger.addContext(context)

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }

  if (!RPC_GATEWAY) {
    logger.error('RPC_GATEWAY is not set')
    return ResponseInternalServerError('RPC_GATEWAY is not set')
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

  logger.appendKeys({
    chainId: params.chainId,
  })

  const rpc = params.rpc ?? getRpcGatewayEndpoint(RPC_GATEWAY, params.chainId, rpcConfig)
  const transport = http(rpc, {
    batch: false,
    fetchOptions: {
      method: 'POST',
    },
  })

  const viemChain: ViemChain = domainChainIdToViemChain[params.chainId]

  const publicClient: PublicClient = createPublicClient({
    transport,
    chain: viemChain,
  })

  const addresses = getAddresses(params.chainId)

  const automationSubgraphClient = getAutomationSubgraphClient({
    urlBase: SUBGRAPH_BASE,
    chainId: params.chainId,
    logger,
  })

  const pricesSubgraphClient = getPricesSubgraphClient({
    urlBase: SUBGRAPH_BASE,
    chainId: params.chainId,
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
    .filter(
      (trigger) =>
        trigger.triggerType == DmaAaveStopLossToCollateralV2ID ||
        trigger.triggerType == LegacyDmaAaveStopLossToCollateralV2ID,
    )
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
    .filter(
      (trigger) =>
        trigger.triggerType == DmaAaveStopLossToDebtV2ID ||
        trigger.triggerType == LegacyDmaAaveStopLossToDebtV2ID,
    )
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
    .filter(
      (trigger) =>
        trigger.triggerType == DmaSparkStopLossToCollateralV2ID ||
        trigger.triggerType == LegacyDmaSparkStopLossToCollateralV2ID,
    )
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
    .filter(
      (trigger) =>
        trigger.triggerType == DmaSparkStopLossToDebtV2ID ||
        trigger.triggerType == LegacyDmaSparkStopLossToDebtV2ID,
    )
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

  const sparkBasicBuy: DmaSparkBasicBuy | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaSparkBasicBuyV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaSparkBasicBuyV2' as const,
        triggerType: DmaSparkBasicBuyV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          maxBuyPrice: trigger.decodedData[trigger.decodedDataNames.indexOf('maxBuyPrice')],
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]

  const sparkBasicSell: DmaSparkBasicSell | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == DmaSparkBasicSellV2ID)
    .map((trigger) => {
      return {
        triggerTypeName: 'DmaSparkBasicSellV2' as const,
        triggerType: DmaSparkBasicSellV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          minSellPrice: trigger.decodedData[trigger.decodedDataNames.indexOf('minSellPrice')],
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]

  const morphoBlueStopLoss: MorphoBlueStopLoss | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == MorphoBlueStopLossV2ID)
    .filter((trigger) => mapTriggersWithSamePoolId({ trigger, poolId: params.poolId }))
    .map((trigger) => {
      return {
        triggerTypeName: 'MorphoBlueStopLossV2' as const,
        triggerType: MorphoBlueStopLossV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapStopLossParams(trigger),
      }
    })[0]

  const morphoBlueBasicBuy: MorphoBlueBasicBuy | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == MorphoBlueBasicBuyV2ID)
    .filter((trigger) => mapTriggersWithSamePoolId({ trigger, poolId: params.poolId }))
    .map((trigger) => {
      const { collateralToken, debtToken } = getTokensFromTrigger(trigger)

      if (!collateralToken || !debtToken) {
        throw new Error('Collateral or debt token data is missing from trigger data')
      }

      return {
        triggerTypeName: 'MorphoBlueBasicBuyV2' as const,
        triggerType: MorphoBlueBasicBuyV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          maxBuyPrice: getMorphoLambdaPriceConverted({
            price: BigInt(trigger.decodedData[trigger.decodedDataNames.indexOf('maxBuyPrice')]),
            collateralDecimals: collateralToken.decimals,
            debtDecimals: debtToken.decimals,
          }).toString(),
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]
  const morphoBlueBasicSell: MorphoBlueBasicSell | undefined = triggers.triggers
    .filter((trigger) => trigger.triggerType == MorphoBlueBasicSellV2ID)
    .filter((trigger) => mapTriggersWithSamePoolId({ trigger, poolId: params.poolId }))
    .map((trigger) => {
      const { collateralToken, debtToken } = getTokensFromTrigger(trigger)

      if (!collateralToken || !debtToken) {
        throw new Error('Collateral or debt token data is missing from trigger data')
      }

      return {
        triggerTypeName: 'MorphoBlueBasicSellV2' as const,
        triggerType: MorphoBlueBasicSellV2ID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: {
          minSellPrice: getMorphoLambdaPriceConverted({
            price: BigInt(trigger.decodedData[trigger.decodedDataNames.indexOf('minSellPrice')]),
            collateralDecimals: collateralToken.decimals,
            debtDecimals: debtToken.decimals,
          }).toString(),
          ...mapBuySellCommonParams(trigger),
        },
      }
    })[0]

  const aaveTrailingStopLossDMA = await getDmaAaveTrailingStopLoss({
    triggers,
    pricesSubgraphClient,
    logger,
  })

  const sparkTrailingStopLossDMA = await getDmaSparkTrailingStopLoss({
    triggers,
    pricesSubgraphClient,
    logger,
  })

  const morphoBlueTrailingStopLoss = await getDmaMorphoBlueTrailingStopLoss({
    triggers,
    poolId: params.poolId,
    pricesSubgraphClient,
    logger,
  })
  const morphoBluePartialTakeProfit = await getMorphoBluePartialTakeProfit({
    triggers,
    poolId: params.poolId,
    logger,
    publicClient,
    getDetails: params.getDetails,
    addresses,
    stopLoss: morphoBlueStopLoss,
  })

  const aaveStopLoss = getCurrentTrigger(
    aaveStopLossToCollateral,
    aaveStopLossToCollateralDMA,
    aaveStopLossToDebt,
    aaveStopLossToDebtDMA,
    aaveTrailingStopLossDMA,
  )
  const sparkStopLoss = getCurrentTrigger(
    sparkStopLossToCollateral,
    sparkStopLossToCollateralDMA,
    sparkStopLossToDebt,
    sparkStopLossToDebtDMA,
    sparkTrailingStopLossDMA,
  )

  const aavePartialTakeProfit = await getDmaAavePartialTakeProfit({
    triggers,
    logger,
    publicClient,
    getDetails: params.getDetails,
    addresses,
    stopLoss: aaveStopLoss,
  })
  const sparkPartialTakeProfit = await getDmaSparkPartialTakeProfit({
    triggers,
    logger,
    publicClient,
    getDetails: params.getDetails,
    addresses,
    stopLoss: sparkStopLoss,
  })

  const response: GetTriggersResponse = {
    triggers: {
      /* deprecated start */
      aaveBasicBuy,
      aaveBasicSell,
      aavePartialTakeProfit,
      aaveStopLossToCollateral,
      aaveStopLossToCollateralDMA,
      aaveStopLossToDebt,
      aaveStopLossToDebtDMA,
      aaveTrailingStopLossDMA,
      sparkBasicBuy,
      sparkBasicSell,
      sparkPartialTakeProfit,
      sparkStopLossToCollateral,
      sparkStopLossToCollateralDMA,
      sparkStopLossToDebt,
      sparkStopLossToDebtDMA,
      sparkTrailingStopLossDMA,
      /* deprecated end */
      [ProtocolId.AAVE3]: {
        basicBuy: aaveBasicBuy,
        basicSell: aaveBasicSell,
        partialTakeProfit: aavePartialTakeProfit,
        stopLossToCollateral: aaveStopLossToCollateral,
        stopLossToCollateralDMA: aaveStopLossToCollateralDMA,
        stopLossToDebt: aaveStopLossToDebt,
        stopLossToDebtDMA: aaveStopLossToDebtDMA,
        trailingStopLossDMA: aaveTrailingStopLossDMA,
      },
      [ProtocolId.SPARK]: {
        basicBuy: sparkBasicBuy,
        basicSell: sparkBasicSell,
        partialTakeProfit: sparkPartialTakeProfit,
        stopLossToCollateral: sparkStopLossToCollateral,
        stopLossToCollateralDMA: sparkStopLossToCollateralDMA,
        stopLossToDebt: sparkStopLossToDebt,
        stopLossToDebtDMA: sparkStopLossToDebtDMA,
        trailingStopLossDMA: sparkTrailingStopLossDMA,
      },
      ...(params.poolId && {
        [`${ProtocolId.MORPHO_BLUE}-${params.poolId}`]: {
          basicBuy: morphoBlueBasicBuy,
          basicSell: morphoBlueBasicSell,
          partialTakeProfit: morphoBluePartialTakeProfit,
          stopLoss: morphoBlueStopLoss,
          trailingStopLoss: morphoBlueTrailingStopLoss,
        },
      }),
    },
    flags: {
      [ProtocolId.AAVE3]: {
        isStopLossEnabled: hasAnyDefined(
          aaveStopLossToCollateral,
          aaveStopLossToCollateralDMA,
          aaveStopLossToDebt,
          aaveStopLossToDebtDMA,
          aaveTrailingStopLossDMA,
        ),
        isBasicBuyEnabled: hasAnyDefined(aaveBasicBuy),
        isBasicSellEnabled: hasAnyDefined(aaveBasicSell),
        isPartialTakeProfitEnabled: hasAnyDefined(aavePartialTakeProfit),
        isTrailingStopLossEnabled: hasAnyDefined(aaveTrailingStopLossDMA),
      },
      [ProtocolId.SPARK]: {
        isStopLossEnabled: hasAnyDefined(
          sparkStopLossToCollateral,
          sparkStopLossToCollateralDMA,
          sparkStopLossToDebt,
          sparkStopLossToDebtDMA,
          sparkTrailingStopLossDMA,
        ),
        isBasicBuyEnabled: hasAnyDefined(sparkBasicBuy),
        isBasicSellEnabled: hasAnyDefined(sparkBasicSell),
        isPartialTakeProfitEnabled: hasAnyDefined(sparkPartialTakeProfit),
        isTrailingStopLossEnabled: hasAnyDefined(sparkTrailingStopLossDMA),
      },
      ...(params.poolId && {
        [`${ProtocolId.MORPHO_BLUE}-${params.poolId}`]: {
          isStopLossEnabled: hasAnyDefined(morphoBlueStopLoss),
          isBasicBuyEnabled: hasAnyDefined(morphoBlueBasicBuy),
          isBasicSellEnabled: hasAnyDefined(morphoBlueBasicSell),
          isPartialTakeProfitEnabled: hasAnyDefined(morphoBluePartialTakeProfit),
          isTrailingStopLossEnabled: hasAnyDefined(morphoBlueTrailingStopLoss),
        },
      }),
      /* deprecated start */
      isAaveStopLossEnabled: hasAnyDefined(
        aaveStopLossToCollateral,
        aaveStopLossToCollateralDMA,
        aaveStopLossToDebt,
        aaveStopLossToDebtDMA,
        aaveTrailingStopLossDMA,
      ),
      isAaveBasicBuyEnabled: hasAnyDefined(aaveBasicBuy),
      isAaveBasicSellEnabled: hasAnyDefined(aaveBasicSell),
      isAavePartialTakeProfitEnabled: hasAnyDefined(aavePartialTakeProfit),
      isSparkStopLossEnabled: hasAnyDefined(
        sparkStopLossToCollateral,
        sparkStopLossToCollateralDMA,
        sparkStopLossToDebt,
        sparkStopLossToDebtDMA,
        sparkTrailingStopLossDMA,
      ),
      isSparkBasicBuyEnabled: hasAnyDefined(sparkBasicBuy),
      isSparkBasicSellEnabled: hasAnyDefined(sparkBasicSell),
      isSparkPartialTakeProfitEnabled: hasAnyDefined(sparkPartialTakeProfit),
      /* deprecated end */
    },
    triggersCount: triggers.triggers.length,
    triggerGroup: {
      aaveBasicBuy: getCurrentTrigger(aaveBasicBuy),
      aaveBasicSell: getCurrentTrigger(aaveBasicSell),
      aavePartialTakeProfit: getCurrentTrigger(aavePartialTakeProfit),
      aaveStopLoss,
      sparkBasicBuy: getCurrentTrigger(sparkBasicBuy),
      sparkBasicSell: getCurrentTrigger(sparkBasicSell),
      sparkPartialTakeProfit: getCurrentTrigger(sparkPartialTakeProfit),
      sparkStopLoss,
      morphoBlueBasicBuy: getCurrentTrigger(morphoBlueBasicBuy),
      morphoBlueBasicSell: getCurrentTrigger(morphoBlueBasicSell),
      morphoBluePartialTakeProfit: getCurrentTrigger(morphoBluePartialTakeProfit),
      morphoBlueStopLoss: getCurrentTrigger(morphoBlueStopLoss, morphoBlueTrailingStopLoss),
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
