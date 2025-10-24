import { useMemo } from 'react'
import { type SupportedNetworkIds } from '@summerfi/app-types'
import { type Chain } from 'viem'

import { publicClientMap } from '@/helpers/get-fe-public-client'

/**
 * Hook to create a Viem public client for interacting with the blockchain
 * @param chain - Viem Chain object containing network configuration
 * @returns Object containing the configured public client
 */
export const usePublicClient = ({ chain }: { chain: Chain }) => {
  const publicClient = useMemo(() => {
    return publicClientMap[
      chain.id as
        | SupportedNetworkIds.ArbitrumOne
        | SupportedNetworkIds.Base
        | SupportedNetworkIds.Mainnet
        | SupportedNetworkIds.SonicMainnet
    ]
  }, [chain])

  return { publicClient }
}
