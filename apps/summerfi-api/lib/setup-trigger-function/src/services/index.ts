import { Address, ChainId, ProtocolId } from '@summerfi/serverless-shared/domain-types'
import { getAddresses } from './get-addresses'
import { Chain as ViemChain, createPublicClient, http, PublicClient } from 'viem'
import { arbitrum, base, mainnet, optimism, sepolia } from 'viem/chains'
import { Logger } from '@aws-lambda-powertools/logger'
import { AutoBuyEventBody, AutoSellEventBody, SetupTriggerEventBody } from '~types'
import type { GetTriggersResponse } from '@summerfi/serverless-contracts/get-triggers-response'
import fetch from 'node-fetch'
import memoize from 'just-memoize'
import {
  getRpcGatewayEndpoint,
  IRpcConfig,
} from '@summerfi/serverless-shared/getRpcGatewayEndpoint'
import { ServiceContainer } from './service-container'
import { TriggerType } from '@oasisdex/automation'
import { getAaveAutoBuyServiceContainer } from './get-aave-auto-buy-service-container'
import { getAaveAutoSellServiceContainer } from './get-aave-auto-sell-service-container'

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

function isAaveAutoBuy(trigger: SetupTriggerEventBody): trigger is AutoBuyEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaAaveBasicBuyV2)
}

function isAaveAutoSell(trigger: SetupTriggerEventBody): trigger is AutoSellEventBody {
  return trigger.triggerData?.type === BigInt(TriggerType.DmaAaveBasicSellV2)
}

export function buildServiceContainer<
  Trigger extends SetupTriggerEventBody,
  Protocol extends ProtocolId,
  Chain extends ChainId,
>(
  chainId: Chain,
  protocol: Protocol,
  trigger: Trigger,
  rpcGateway: string,
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

  const getTriggers = memoize(async (address: Address) => {
    try {
      const triggers = await fetch(`${getTriggersUrl}?chainId=${chainId}&dpm=${address}`)
      return (await triggers.json()) as GetTriggersResponse
    } catch (e) {
      logger?.error('Error fetching triggers', { error: e })
      throw e
    }
  })

  if (isAaveAutoBuy(trigger)) {
    return getAaveAutoBuyServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
    }) as ServiceContainer<Trigger>
  }
  if (isAaveAutoSell(trigger)) {
    return getAaveAutoSellServiceContainer({
      rpc: publicClient,
      addresses,
      getTriggers,
      logger,
    }) as ServiceContainer<Trigger>
  }

  throw new Error(`Unsupported trigger type: ${trigger.triggerData?.type}`)
}
