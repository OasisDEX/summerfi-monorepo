import { type SDKVaultsListType } from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client'

export type PortfolioPositionsDataParams = {
  position: IArmadaPosition
  vaultsList: SDKVaultsListType // not vaultish, this is the list, not the vault "details"
}

// since we dont have vault details on the positions list
// we need to merge the vault details with the position
export const portfolioPositionsHandler = ({
  position,
  vaultsList,
}: PortfolioPositionsDataParams) => {
  const vaultData = vaultsList.find((vault) => vault.id === position.vault.id.fleetAddress.value)

  if (!vaultData) {
    throw new Error(`Vault not found for position ${position.vault.id.fleetAddress.value}`)
  }

  return {
    positionData: position,
    vaultData,
  }
}

export type PortfolioPositionsList = ReturnType<typeof portfolioPositionsHandler>
