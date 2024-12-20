import { useMemo } from 'react'
import { type SDKChainId } from '@summerfi/app-types'
import { createPublicClient, http } from 'viem'

import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'
import { useUpdateAANetwork } from '@/hooks/use-update-aa-network'

type UseClientProps = {
  chainId?: SDKChainId.ARBITRUM | SDKChainId.BASE
}

export const useClient = (params?: UseClientProps) => {
  const { appChain } = useUpdateAANetwork()
  const _chainId: SDKChainId.ARBITRUM | SDKChainId.BASE =
    params?.chainId ?? (appChain.id as SDKChainId.ARBITRUM | SDKChainId.BASE)

  // Client for read-only data fetching using our rpcGateway
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: appChain,
      transport: http(SDKChainIdToRpcGatewayMap[_chainId]),
    })
  }, [appChain, _chainId])

  return {
    publicClient,
  }
}
