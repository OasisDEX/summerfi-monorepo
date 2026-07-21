import { SupportedNetworkIds } from '@summerfi/app-types'
import { createPublicClient, http, type PublicClient } from 'viem'
import { arbitrum, base, hyperliquid as hyperliquidBase, mainnet, sonic } from 'viem/chains'

import { SDKChainIdToSSRRpcGatewayMap } from '@/helpers/rpc-gateway-ssr'

// viem's bundled HyperEVM chain has no multicall3 entry, but the canonical multicall3 is deployed
// there (same address/block as the SDK's own chain definition) — without it `multicall` throws
// ChainDoesNotSupportContract.
const hyperliquid = {
  ...hyperliquidBase,
  contracts: {
    ...hyperliquidBase.contracts,
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 13051,
    },
  },
} as const

export const SSRChainConfigs = [
  { chain: base, chainId: SupportedNetworkIds.Base, chainName: 'base' },
  { chain: mainnet, chainId: SupportedNetworkIds.Mainnet, chainName: 'mainnet' },
  { chain: arbitrum, chainId: SupportedNetworkIds.ArbitrumOne, chainName: 'arbitrum' },
  { chain: sonic, chainId: SupportedNetworkIds.SonicMainnet, chainName: 'sonic' },
  { chain: hyperliquid, chainId: SupportedNetworkIds.Hyperliquid, chainName: 'hyperliquid' },
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
