import { useMemo } from 'react'
import { type SDKChainId } from '@summerfi/app-types'

import { publicClientMap } from '@/helpers/get-fe-public-client'
import { useUpdateAANetwork } from '@/hooks/use-update-aa-network'

type UseClientProps = {
  chainId?: SDKChainId.ARBITRUM | SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.SONIC
  overrideNetwork?: string
}

/**
 * Hook to create a public client with enforced update of network to the one from url.
 * Should only be used in places where network is in url and there is a need to align
 * client network to the one from url.
 */
export const useNetworkAlignedClient = (params?: UseClientProps) => {
  const { appChain } = useUpdateAANetwork(params?.overrideNetwork)

  const _chainId: SDKChainId.ARBITRUM | SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.SONIC =
    params?.chainId ??
    (appChain.id as SDKChainId.ARBITRUM | SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.SONIC)

  // Client for read-only data fetching using our rpcGateway
  const publicClient = useMemo(() => {
    return publicClientMap[_chainId]
  }, [_chainId])

  return {
    publicClient,
  }
}
