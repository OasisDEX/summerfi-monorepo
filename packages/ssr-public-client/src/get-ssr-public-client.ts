import { SDKChainId } from '@summerfi/app-types'
import { type Chain, createPublicClient, http, type PublicClient } from 'viem'
import { arbitrum, base, mainnet, sonic } from 'viem/chains'

import { SDKChainIdToSSRRpcGatewayMap } from './rpc-gateway-ssr'

export const SSRChainConfigs: { chain: Chain; chainId: SDKChainId; chainName: string }[] = [
  { chain: base, chainId: SDKChainId.BASE, chainName: 'base' },
  { chain: mainnet, chainId: SDKChainId.MAINNET, chainName: 'mainnet' },
  { chain: arbitrum, chainId: SDKChainId.ARBITRUM, chainName: 'arbitrum' },
  { chain: sonic, chainId: SDKChainId.SONIC, chainName: 'sonic' },
]

const publicClientsMap = new Map<SDKChainId, PublicClient>()

export const getSSRPublicClient: (
  chainId: SDKChainId,
) => Promise<PublicClient | undefined> = async (chainId: SDKChainId) => {
  if (publicClientsMap.has(chainId)) {
    return publicClientsMap.get(chainId)
  }
  const chainConfig = SSRChainConfigs.find((ssrChainConfig) => ssrChainConfig.chainId === chainId)

  if (!chainConfig) {
    throw new Error(`Chain ${chainId} not found`)
  }
  const { chain } = chainConfig
  const newPublicClient = createPublicClient({
    chain,
    transport: http(await SDKChainIdToSSRRpcGatewayMap[chainId]),
  }) as PublicClient

  publicClientsMap.set(chainId, newPublicClient)

  return newPublicClient
}
