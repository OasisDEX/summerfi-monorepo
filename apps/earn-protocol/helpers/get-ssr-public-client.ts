import { SupportedNetworkIds } from '@summerfi/app-types'
import { createPublicClient, http, type PublicClient } from 'viem'
import { arbitrum, base, mainnet, optimism, sonic } from 'viem/chains'

import { SDKChainIdToSSRRpcGatewayMap } from '@/helpers/rpc-gateway-ssr'

export const SSRChainConfigs = [
  { chain: base, chainId: SupportedNetworkIds.Base, chainName: 'base' },
  { chain: mainnet, chainId: SupportedNetworkIds.Mainnet, chainName: 'mainnet' },
  { chain: arbitrum, chainId: SupportedNetworkIds.ArbitrumOne, chainName: 'arbitrum' },
  { chain: sonic, chainId: SupportedNetworkIds.SonicMainnet, chainName: 'sonic' },
  { chain: optimism, chainId: SupportedNetworkIds.Optimism, chainName: 'optimism' },
]

const publicClientsMap = new Map<SupportedNetworkIds, PublicClient>()

export const getSSRPublicClient: (
  chainId: SupportedNetworkIds,
) => Promise<PublicClient | undefined> = async (chainId: SupportedNetworkIds) => {
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
