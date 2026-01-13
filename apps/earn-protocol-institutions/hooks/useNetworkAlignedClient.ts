import { useMemo } from 'react'
import { type SupportedNetworkIds } from '@summerfi/app-types'

import { publicClientMap } from '@/helpers/get-fe-public-client'
import { useUpdateAANetwork } from '@/hooks/useUpdateAaNetwork'

type UseClientProps = {
  chainId?: SupportedNetworkIds
  overrideNetwork?: string
}

/**
 * Hook to create a public client with enforced update of network to the one from url.
 * Should only be used in places where network is in url and there is a need to align
 * client network to the one from url.
 */
export const useNetworkAlignedClient = (params?: UseClientProps) => {
  const { appChain } = useUpdateAANetwork(params?.overrideNetwork)

  const _chainId: SupportedNetworkIds = params?.chainId ?? (appChain.id as SupportedNetworkIds)

  // Client for read-only data fetching using our rpcGateway
  const publicClient = useMemo(() => {
    return publicClientMap[_chainId]
  }, [_chainId])

  return {
    publicClient,
  }
}
