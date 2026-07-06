import { cache } from 'react'
import { type IArmadaPosition, type SupportedSDKNetworks } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendSDK, getBackendInstiSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { getVaultRwaClientId } from '@/helpers/vault-custom-value-helpers'

// React's `cache()` de-dupes by argument identity/value, not by shape, so the memoized function
// below takes primitives (network, vaultAddress, walletAddress, isRwaVault) rather than the object
// literal `getUserPosition` receives from its callers — a fresh object literal per call site would
// never hit the cache (object args are keyed by reference). Callers keep calling `getUserPosition`
// with the same object-shaped signature as before; it just delegates to the memoized primitives-only
// function, so repeated calls within one request (metadata / page body / manage-context resolver)
// with the same (network, vaultAddress, walletAddress, isRwaVault) share a single SDK round-trip.
const getCachedUserPosition = cache(
  async (
    network: SupportedSDKNetworks,
    vaultAddress: string | undefined,
    walletAddress: string,
    // RWA Fleet positions are indexed in the institutional subgraph, not the public one, so they must
    // be read through the institutional SDK (which sends the Client-Id + Insti-Version headers).
    isRwaVault: boolean,
  ) => {
    try {
      if (!vaultAddress) {
        return undefined
      }

      const chainId = subgraphNetworkToId(network)
      const chainInfo = getChainInfoByChainId(chainId)

      const fleetAddress = Address.createFromEthereum({
        value: vaultAddress,
      })

      const wallet = Wallet.createFrom({
        address: Address.createFromEthereum({
          value: walletAddress.toLowerCase(),
        }),
      })
      const user = User.createFrom({
        chainInfo,
        wallet,
      })

      // RWA Fleet positions are read through the institution's SDK instance (its Client-Id header
      // selects the right deployment). The institution is resolved from the vault's
      // `vaultInstitutionId`; a disabled/unconfigured RWA vault has no client id → no position to read.
      let instiSdk: ReturnType<typeof getBackendInstiSDK> | undefined

      if (isRwaVault) {
        const systemConfig = await getCachedConfig()
        const clientId = getVaultRwaClientId(vaultAddress, chainId, systemConfig)

        if (!clientId) {
          return undefined
        }

        instiSdk = getBackendInstiSDK(clientId)
      }

      const position = await (instiSdk ?? backendSDK).armada.users.getUserPosition({
        fleetAddress,
        user,
      })

      return position as IArmadaPosition | undefined
    } catch (error) {
      return serverOnlyErrorHandler('getUserPosition', error as string)
    }
  },
)

export function getUserPosition({
  network,
  vaultAddress,
  walletAddress,
  isRwaVault = false,
}: {
  network: SupportedSDKNetworks
  vaultAddress?: string
  walletAddress: string
  // RWA Fleet positions are indexed in the institutional subgraph, not the public one, so they must
  // be read through the institutional SDK (which sends the Client-Id + Insti-Version headers).
  isRwaVault?: boolean
}) {
  return getCachedUserPosition(network, vaultAddress, walletAddress, isRwaVault)
}
