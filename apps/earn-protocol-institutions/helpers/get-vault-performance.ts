import { type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'

import { VAULTS_STARTING_NAV_VALUES } from '@/constants/vaults-starting-nav-values'

export const getVaultPerformance = (vault: SDKVaultishType) => {
  const initialVaultNavValue =
    VAULTS_STARTING_NAV_VALUES[
      `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
    ]

  if (!initialVaultNavValue || !vault.pricePerShare) {
    return null
  }

  // ((navPriceNow - startingNavPrice) / startingNavPrice) * 100
  return ((Number(vault.pricePerShare) - initialVaultNavValue) / initialVaultNavValue) * 100
}
