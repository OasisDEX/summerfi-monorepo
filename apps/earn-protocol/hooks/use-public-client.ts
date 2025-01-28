import { useMemo } from 'react'
import { type SDKChainId } from '@summerfi/app-types'
import { type Chain, createPublicClient, http, type PublicClient } from 'viem'

import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'

/**
 * Hook to create a Viem public client for interacting with the blockchain
 * @param chain - Viem Chain object containing network configuration
 * @returns Object containing the configured public client
 */
export const usePublicClient = ({ chain }: { chain: Chain }): { publicClient: PublicClient } => {
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain,
      transport: http(SDKChainIdToRpcGatewayMap[chain.id as SDKChainId]),
    })
  }, [chain])

  return { publicClient }
}
