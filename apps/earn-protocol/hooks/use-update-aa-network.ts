'use client'
import { useEffect } from 'react'
import { arbitrum, base, mainnet } from '@account-kit/infra'
import { useChain } from '@account-kit/react'
import { humanNetworktoSDKNetwork, subgraphNetworkToId } from '@summerfi/app-utils'
import { useParams } from 'next/navigation'

import { customAAKitSonicConfig as sonic } from '@/account-kit/config'
import { NetworkIds } from '@/constants/networks-list'
import { useClientChainId } from '@/hooks/use-client-chain-id'

const networkIdsToAccountKitChainsMap = {
  [NetworkIds.BASEMAINNET]: base,
  [NetworkIds.ARBITRUMMAINNET]: arbitrum,
  [NetworkIds.MAINNET]: mainnet,
  [NetworkIds.SONICMAINNET]: sonic,
}

// Update account kit network based on app network derived from currently displayed strategy
// To avoid forced EOA popups to change network, trigger it only when EOA wallet network and app network are already aligned
// Unless overridden by the `overrideNetwork` parameter

/**
 * Hook to update the Account Kit network.
 *
 * @param overrideNetwork - Optionally pass a network string to override the one from URL params.
 *
 * When provided, this hook will use the `overrideNetwork` value rather than pulling it from
 * the `useParams()` hook.
 */
export const useUpdateAANetwork = (overrideNetwork?: string) => {
  const { clientChainId } = useClientChainId()
  const params = useParams()

  // Use the passed in network, if provided, otherwise fall back to URL params.
  const network = overrideNetwork ?? params.network

  const { setChain } = useChain()

  const sdkNetwork = humanNetworktoSDKNetwork(network as string)
  const appChainId = subgraphNetworkToId(sdkNetwork) as
    | NetworkIds.BASEMAINNET
    | NetworkIds.ARBITRUMMAINNET
    | NetworkIds.MAINNET
    | NetworkIds.SONICMAINNET

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
