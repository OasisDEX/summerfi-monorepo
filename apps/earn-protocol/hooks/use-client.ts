import { useMemo } from 'react'
import { type SDKChainId } from '@summerfi/app-types'
import { createPublicClient, http } from 'viem'

import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'
import { useUpdateAANetwork } from '@/hooks/use-update-aa-network'

export const useClient = () => {
  const { appChain } = useUpdateAANetwork()

  // Client for read-only data fetching using our rpcGateway
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: appChain,
      transport: http(
        SDKChainIdToRpcGatewayMap[appChain.id as SDKChainId.ARBITRUM | SDKChainId.BASE],
      ),
    })
  }, [appChain])

  return {
    publicClient,
  }
}
