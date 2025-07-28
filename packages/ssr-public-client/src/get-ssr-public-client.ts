import { SupportedNetworkIds } from '@summerfi/app-types'
import { type Chain, createPublicClient, http, type PublicClient } from 'viem'
import { arbitrum, base, mainnet, sonic } from 'viem/chains'

import { SDKChainIdToSSRRpcGatewayMap } from './rpc-gateway-ssr'

export const SSRChainConfigs: { chain: Chain; chainId: SupportedNetworkIds; chainName: string }[] =
  [
    { chain: base, chainId: SupportedNetworkIds.Base, chainName: 'base' },
    { chain: mainnet, chainId: SupportedNetworkIds.Mainnet, chainName: 'mainnet' },
    { chain: arbitrum, chainId: SupportedNetworkIds.ArbitrumOne, chainName: 'arbitrum' },
    { chain: sonic, chainId: SupportedNetworkIds.SonicMainnet, chainName: 'sonic' },
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
