import {
  type EarnAppConfigType,
  type SDKVaultishType,
  type SDKVaultsListType,
} from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client'

import { getCustomVaultConfigById } from '@/helpers/vault-custom-value-helpers'

export type PortfolioPositionsDataParams = {
  position: IArmadaPosition
  vaultsList: SDKVaultsListType // not vaultish, this is the list, not the vault "details"
  config: Partial<EarnAppConfigType>
}

// since we dont have vault details on the positions list
// we need to merge the vault details with the position
export const portfolioPositionsHandler = ({
  position,
  vaultsList,
  config,
}: PortfolioPositionsDataParams) => {
  const vaultData = vaultsList.find((vault) => vault.id === position.pool.id.fleetAddress.value)

  if (!vaultData) {
    throw new Error(`Vault not found for position ${position.pool.id.fleetAddress.value}`)
  }
  const parsedNetworkId = subgraphNetworkToId(vaultData.protocol.network)
  const customFields = getCustomVaultConfigById(vaultData.id, String(parsedNetworkId), config)

  return {
    positionData: position,
    vaultData: {
      ...vaultData,
      customFields,
    } as SDKVaultishType,
  }
}

export type PortfolioPositionsList = ReturnType<typeof portfolioPositionsHandler>
