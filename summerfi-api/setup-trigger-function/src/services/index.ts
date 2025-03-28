import { Address, ChainId, PoolId, ProtocolId } from '@summerfi/serverless-shared/domain-types'
import { getAddresses } from '@summerfi/triggers-shared'
import { Chain as ViemChain, createPublicClient, http, PublicClient } from 'viem'
import { arbitrum, base, mainnet, optimism, sepolia, sonic } from 'viem/chains'
import { Logger } from '@aws-lambda-powertools/logger'
import {
  AaveAutoBuyEventBody,
  AaveAutoSellEventBody,
  AavePartialTakeProfitEventBody,
  AaveStopLossEventBody,
  AaveTrailingStopLossEventBody,
  MorphoBlueAutoBuyEventBody,
  MorphoBlueAutoSellEventBody,
  MorphoBluePartialTakeProfitEventBody,
  MorphoBlueStopLossEventBody,
  MorphoBlueTrailingStopLossEventBody,
  SetupTriggerEventBody,
  SparkAutoBuyEventBody,
  SparkAutoSellEventBody,
  SparkPartialTakeProfitEventBody,
  SparkStopLossEventBody,
  SparkTrailingStopLossEventBody,
} from '~types'
import type { GetTriggersResponse } from '@summerfi/triggers-shared/contracts'
import fetch from 'node-fetch'
import memoize from 'just-memoize'
import { getRpcGatewayEndpoint, IRpcConfig } from '@summerfi/serverless-shared'
import { ServiceContainer } from './service-container'
import { TriggerType } from '@oasisdex/automation'
import { getAaveAutoBuyServiceContainer } from './get-aave-auto-buy-service-container'
import { getAaveAutoSellServiceContainer } from './get-aave-auto-sell-service-container'
import { getAaveStopLossServiceContainer } from './get-aave-stop-loss-service-container'
import { getSparkStopLossServiceContainer } from './get-spark-stop-loss-service-container'
import { getAaveTrailingStopLossServiceContainer } from './get-aave-trailing-stop-loss-service-container'
import { getPricesSubgraphClient } from '@summerfi/prices-subgraph'
import { getSparkAutoBuyServiceContainer } from './get-spark-auto-buy-service-container'
import { getSparkAutoSellServiceContainer } from './get-spark-auto-sell-service-container'
import { getSparkTrailingStopLossServiceContainer } from './get-spark-trailing-stop-loss-service-container'
import { getAavePartialTakeProfitServiceContainer } from './get-aave-partial-take-profit-service-container'
import { getSparkPartialTakeProfitServiceContainer } from './get-spark-partial-take-profit-service-container'
import { getMorphoBlueStopLossServiceContainer } from './get-morphoblue-stop-loss-service-container'
import { getMorphoBlueAutoBuyServiceContainer } from './get-morphoblue-auto-buy-service-container'
import { getMorphoBlueAutoSellServiceContainer } from './get-morphoblue-auto-sell-service-container'
import { getMorphoBlueTrailingStopLossServiceContainer } from './get-morphoblue-trailing-stop-loss-service-container'
import { getMorphoBluePartialTakeProfitServiceContainer } from './get-morphoblue-partial-take-profit-service-container'

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
  [ChainId.SONIC]: sonic,
}

// Aave checks
function isAaveAutoBuy(trigger: SetupTriggerEventBody): trigger is AaveAutoBuyEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaAaveBasicBuyV2)
}

function isAaveAutoSell(trigger: SetupTriggerEventBody): trigger is AaveAutoSellEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaAaveBasicSellV2)
}

function isAaveStopLoss(trigger: SetupTriggerEventBody): trigger is AaveStopLossEventBody {
  return [
    BigInt(TriggerType.DmaAaveStopLossToCollateralV2),
    BigInt(TriggerType.DmaAaveStopLossToDebtV2),
  ].includes(trigger.triggerData?.type)
}

function isAaveTrailingStopLoss(
  trigger: SetupTriggerEventBody,
): trigger is AaveTrailingStopLossEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaAaveTrailingStopLossV2)
}

function isAavePartialTakeProfit(
  trigger: SetupTriggerEventBody,
): trigger is AavePartialTakeProfitEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaAavePartialTakeProfitV2)
}

// Spark checks
function isSparkStopLoss(trigger: SetupTriggerEventBody): trigger is SparkStopLossEventBody {
  return [
    BigInt(TriggerType.DmaSparkStopLossToCollateralV2),
    BigInt(TriggerType.DmaSparkStopLossToDebtV2),
  ].includes(trigger.triggerData?.type)
}

function isSparkAutoBuy(trigger: SetupTriggerEventBody): trigger is SparkAutoBuyEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaSparkBasicBuyV2)
}

function isSparkAutoSell(trigger: SetupTriggerEventBody): trigger is SparkAutoSellEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaSparkBasicSellV2)
}

function isSparkTrailingStopLoss(
  trigger: SetupTriggerEventBody,
): trigger is SparkTrailingStopLossEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaSparkTrailingStopLossV2)
}

function isSparkPartialTakeProfit(
  trigger: SetupTriggerEventBody,
): trigger is SparkPartialTakeProfitEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaSparkPartialTakeProfitV2)
}

// Morpho blue checks
function isMorphoBlueStopLoss(
  trigger: SetupTriggerEventBody,
): trigger is MorphoBlueStopLossEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaMorphoBlueStopLossV2)
}

function isMorphoBlueAutoBuy(
  trigger: SetupTriggerEventBody,
): trigger is MorphoBlueAutoBuyEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaMorphoBlueBasicBuyV2)
}

function isMorphoBlueAutoSell(
  trigger: SetupTriggerEventBody,
): trigger is MorphoBlueAutoSellEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaMorphoBlueBasicSellV2)
}

function isMorphoBlueTrailingStopLoss(
  trigger: SetupTriggerEventBody,
): trigger is MorphoBlueTrailingStopLossEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaMorphoBlueTrailingStopLossV2)
}

function isMorphoBluePartialTakeProfit(
  trigger: SetupTriggerEventBody,
): trigger is MorphoBluePartialTakeProfitEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaMorphoBluePartialTakeProfitV2)
}

export function buildServiceContainer<Trigger extends SetupTriggerEventBody>(
  chainId: ChainId,
  protocol: ProtocolId,
  trigger: Trigger,
  rpcGateway: string,
  subgraphBase: string,
  getTriggersUrl: string,
  logger?: Logger,
): ServiceContainer<Trigger> {
  const rpc = trigger.rpc ?? getRpcGatewayEndpoint(rpcGateway, chainId, rpcConfig)
  const transport = http(rpc, {
    batch: false,
    fetchOptions: {
      method: 'POST',
    },
  })

  const viemChain: ViemChain = domainChainIdToViemChain[chainId]

  const publicClient: PublicClient = createPublicClient({
    transport,
    chain: viemChain,
  })

  const addresses = getAddresses(chainId)

  const getTriggers = memoize(async (address: Address, poolId?: PoolId) => {
    try {
      const triggers = await fetch(
        `${getTriggersUrl}?chainId=${chainId}&dpm=${address}${poolId ? `&poolId=${poolId}` : ''}`,
      )
      return (await triggers.json()) as GetTriggersResponse
    } catch (e) {
      logger?.error('Error fetching triggers', { error: e })
      throw e
    }
  })

  const pricesClient = getPricesSubgraphClient({
    chainId,
    urlBase: subgraphBase,
    logger,
  })

  const getLatestPrice = memoize(async (token: Address, denomination: Address) => {
    try {
      return await pricesClient.getLatestPrice({ token, denomination })
    } catch (e) {
      logger?.error('Error fetching latest price', { error: e })
      throw e
    }
  })

  // Aave services
  if (isAaveAutoBuy(trigger)) {
    return getAaveAutoBuyServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
    }) as ServiceContainer<Trigger>
  }
  if (isAaveAutoSell(trigger)) {
    return getAaveAutoSellServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
    }) as ServiceContainer<Trigger>
  }
  if (isAaveStopLoss(trigger)) {
    return getAaveStopLossServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
    }) as ServiceContainer<Trigger>
  }
  if (isAaveTrailingStopLoss(trigger)) {
    return getAaveTrailingStopLossServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      getLatestPrice,
      chainId,
      logger,
    }) as ServiceContainer<Trigger>
  }
  if (isAavePartialTakeProfit(trigger)) {
    return getAavePartialTakeProfitServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
      getLatestPrice,
    }) as ServiceContainer<Trigger>
  }
  // Spark services
  if (isSparkStopLoss(trigger)) {
    return getSparkStopLossServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
    }) as ServiceContainer<Trigger>
  }
  if (isSparkAutoBuy(trigger)) {
    return getSparkAutoBuyServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
    }) as ServiceContainer<Trigger>
  }
  if (isSparkAutoSell(trigger)) {
    return getSparkAutoSellServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
    }) as ServiceContainer<Trigger>
  }
  if (isSparkTrailingStopLoss(trigger)) {
    return getSparkTrailingStopLossServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      getLatestPrice,
      chainId,
      logger,
    }) as ServiceContainer<Trigger>
  }
  if (isSparkPartialTakeProfit(trigger)) {
    return getSparkPartialTakeProfitServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
      getLatestPrice,
    }) as ServiceContainer<Trigger>
  }
  // Morpho blue services
  if (isMorphoBlueStopLoss(trigger)) {
    return getMorphoBlueStopLossServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
    }) as ServiceContainer<Trigger>
  }
  if (isMorphoBlueAutoBuy(trigger)) {
    return getMorphoBlueAutoBuyServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
    }) as ServiceContainer<Trigger>
  }
  if (isMorphoBlueAutoSell(trigger)) {
    return getMorphoBlueAutoSellServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
    }) as ServiceContainer<Trigger>
  }
  if (isMorphoBlueTrailingStopLoss(trigger)) {
    return getMorphoBlueTrailingStopLossServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      getLatestPrice,
      chainId,
      logger,
    }) as ServiceContainer<Trigger>
  }
  if (isMorphoBluePartialTakeProfit(trigger)) {
    return getMorphoBluePartialTakeProfitServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
      chainId,
      getLatestPrice,
    }) as ServiceContainer<Trigger>
  }

  throw new Error(`Unsupported trigger`, trigger)
}
