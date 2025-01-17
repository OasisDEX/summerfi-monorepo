'use client'
import { useEffect } from 'react'
import { arbitrum, base, mainnet } from '@account-kit/infra'
import { useChain } from '@account-kit/react'
import { humanNetworktoSDKNetwork, subgraphNetworkToId } from '@summerfi/app-utils'
import { useParams } from 'next/navigation'

import { NetworkIds } from '@/constants/networks-list'
import { useClientChainId } from '@/hooks/use-client-chain-id'

export const networkIdsToAccountKitChainsMap = {
  [NetworkIds.BASEMAINNET]: base,
  [NetworkIds.ARBITRUMMAINNET]: arbitrum,
  [NetworkIds.MAINNET]: mainnet,
}

// Update account kit network based on app network derived from currently displayed strategy
// To avoid forced EOA popups to change network, trigger it only when EOA wallet network and app network are already aligned
export const useUpdateAANetwork = () => {
  const { clientChainId } = useClientChainId()
  const params = useParams()
  const { network } = params

  const { setChain } = useChain()

  const sdkNetwork = humanNetworktoSDKNetwork(network as string)
  const appChainId = subgraphNetworkToId(sdkNetwork) as
    | NetworkIds.BASEMAINNET
    | NetworkIds.ARBITRUMMAINNET

  const appChain = networkIdsToAccountKitChainsMap[appChainId]

  useEffect(() => {
    if (clientChainId === appChainId) {
      setChain({ chain: appChain })
      // eslint-disable-next-line no-console
      console.info(`Updated app network to: ${appChain.id}`)
    }
  }, [appChain, setChain, clientChainId, appChainId])

  return { clientChainId, appChainId, appChain }
}
