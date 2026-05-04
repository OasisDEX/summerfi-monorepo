'use client'
import { useEffect } from 'react'
import { getEarnProtocolChainById, useEarnProtocolChain } from '@summerfi/app-earn-ui'
import {
  humanNetworktoSDKNetwork,
  subgraphNetworkToId,
  supportedSDKNetwork,
  supportedSDKNetworkId,
} from '@summerfi/app-utils'
import { useParams } from 'next/navigation'

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
  const params = useParams()

  // Use the passed in network, if provided, otherwise fall back to URL params.
  const network = overrideNetwork ?? params.network

  const { setChain, chain } = useEarnProtocolChain()

  const sdkNetwork = humanNetworktoSDKNetwork(network as string)
  const appChainId = supportedSDKNetworkId(subgraphNetworkToId(supportedSDKNetwork(sdkNetwork)))

  const appChain = getEarnProtocolChainById(appChainId)

  useEffect(() => {
    if (chain.id === appChainId) {
      setChain({ chain: appChain })
      // eslint-disable-next-line no-console
      console.info(`Updated app network to: ${appChain.id}`)
    }
  }, [appChain, setChain, chain.id, appChainId])

  return { clientChainId: chain.id, appChainId, appChain }
}
