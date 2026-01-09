import { TriggersQuery } from '@summerfi/automation-subgraph'
import { getPricesSubgraphClient } from '@summerfi/prices-subgraph'
import { ChainId, getRpcGatewayEndpoint, IRpcConfig } from '@summerfi/serverless-shared'
import { getAddresses } from '@summerfi/triggers-shared'
import {
  MakerAutoTakeProfitToCollateralID,
  MakerAutoTakeProfitToDaiID,
  MakerAutoTakeProfitToCollateral,
  MakerAutoTakeProfitToDebt,
} from '@summerfi/triggers-shared/contracts'
import { createPublicClient, http, PublicClient, Chain as ViemChain } from 'viem'
import { arbitrum, base, hyperliquid, mainnet, optimism, sepolia, sonic } from 'viem/chains'
import { z } from 'zod'
import { paramsSchema } from '../constants'
import {
  getCurrentTrigger,
  mapMakerDecodedAutoTakeProfitParams,
  mapTriggerCommonParams,
} from '../helpers'
import {
  getDmaAavePartialTakeProfit,
  getDmaAaveTrailingStopLoss,
  getDmaMorphoBlueTrailingStopLoss,
  getDmaSparkPartialTakeProfit,
  getDmaSparkTrailingStopLoss,
} from '../trigger-parsers'
import { getMorphoBluePartialTakeProfit } from '../trigger-parsers/dma-morphoblue-partial-take-profit'
import { getSimpleTriggers } from './get-simple-triggers'
import { logger } from './logger'
import { filterTrigger } from './filter-trigger'
import { getMakerInfo } from './get-maker-info'

const rpcConfig: IRpcConfig = {
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
  [ChainId.SONIC]: sonic,
  [ChainId.HYPERLIQUID]: hyperliquid,
}

export const getAdvancedTriggers = async ({
  triggers,
  simpleTriggers,
  params,
  envs,
}: {
  triggers: TriggersQuery
  simpleTriggers: ReturnType<typeof getSimpleTriggers>
  params: z.infer<typeof paramsSchema>
  envs: Record<string, string>
}) => {
  const {
    aaveStopLossToCollateral,
    aaveStopLossToCollateralDMA,
    aaveStopLossToDebt,
    aaveStopLossToDebtDMA,
    sparkStopLossToCollateral,
    sparkStopLossToCollateralDMA,
    sparkStopLossToDebt,
    sparkStopLossToDebtDMA,
    morphoBlueStopLoss,
  } = simpleTriggers

  const rpc = params.rpc ?? getRpcGatewayEndpoint(envs.RPC_GATEWAY, params.chainId, rpcConfig)
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

  const pricesSubgraphClient = getPricesSubgraphClient({
    urlBase: envs.SUBGRAPH_BASE,
    chainId: params.chainId,
    logger,
  })

  const autoTakeProfitTriggers = triggers.triggers.filter(
    (trigger) =>
      BigInt(trigger.triggerType) === MakerAutoTakeProfitToCollateralID ||
      BigInt(trigger.triggerType) === MakerAutoTakeProfitToDaiID,
  )

  const hasAutoTakeProfit = !!autoTakeProfitTriggers.length

  const makerPositionInfo = hasAutoTakeProfit
    ? await getMakerInfo({
        publicClient,
        trigger: autoTakeProfitTriggers[0],
      })
    : undefined

  const makerAutoTakeProfitToCollateral: MakerAutoTakeProfitToCollateral | undefined =
    triggers.triggers.filter(filterTrigger(MakerAutoTakeProfitToCollateralID)).map((trigger) => {
      return {
        triggerTypeName: 'MakerAutoTakeProfitToCollateral' as const,
        triggerType: MakerAutoTakeProfitToCollateralID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerDecodedAutoTakeProfitParams(trigger, makerPositionInfo),
      }
    })[0]

  const makerAutoTakeProfitToDai: MakerAutoTakeProfitToDebt | undefined = triggers.triggers
    .filter(filterTrigger(MakerAutoTakeProfitToDaiID))
    .map((trigger) => {
      return {
        triggerTypeName: 'MakerAutoTakeProfitToDai' as const,
        triggerType: MakerAutoTakeProfitToDaiID,
        ...mapTriggerCommonParams(trigger),
        decodedParams: mapMakerDecodedAutoTakeProfitParams(trigger, makerPositionInfo),
      }
    })[0]

  const [
    aaveTrailingStopLossDMA,
    sparkTrailingStopLossDMA,
    morphoBlueTrailingStopLoss,
    morphoBluePartialTakeProfit,
  ] = await Promise.all([
    getDmaAaveTrailingStopLoss({
      triggers,
      pricesSubgraphClient,
      logger,
    }),
    getDmaSparkTrailingStopLoss({
      triggers,
      pricesSubgraphClient,
      logger,
    }),
    getDmaMorphoBlueTrailingStopLoss({
      triggers,
      poolId: params.poolId,
      pricesSubgraphClient,
      logger,
    }),
    getMorphoBluePartialTakeProfit({
      triggers,
      poolId: params.poolId,
      logger,
      publicClient,
      getDetails: params.getDetails,
      addresses,
      stopLoss: morphoBlueStopLoss,
    }),
  ])

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

  const [aavePartialTakeProfit, sparkPartialTakeProfit] = await Promise.all([
    getDmaAavePartialTakeProfit({
      triggers,
      logger,
      publicClient,
      getDetails: params.getDetails,
      addresses,
      stopLoss: aaveStopLoss,
    }),
    await getDmaSparkPartialTakeProfit({
      triggers,
      logger,
      publicClient,
      getDetails: params.getDetails,
      addresses,
      stopLoss: sparkStopLoss,
    }),
  ])

  return {
    aavePartialTakeProfit,
    aaveStopLoss,
    aaveTrailingStopLossDMA,
    morphoBluePartialTakeProfit,
    morphoBlueTrailingStopLoss,
    sparkPartialTakeProfit,
    sparkStopLoss,
    sparkTrailingStopLossDMA,
    makerAutoTakeProfitToCollateral,
    makerAutoTakeProfitToDai,
  }
}
