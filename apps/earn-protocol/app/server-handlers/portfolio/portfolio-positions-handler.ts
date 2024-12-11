import { type EarnAppConfigType, type SDKVaultsListType } from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client'

import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

export type PortfolioPositionsDataParams = {
  position: IArmadaPosition
  vaultsList: SDKVaultsListType // not vaultish, this is the list, not the vault "details"
  config: Partial<EarnAppConfigType>
}

// since we dont have vault details on the positions list
// we need to merge the vault details with the position
export const portfolioPositionsHandler = async ({
  position,
  vaultsList,
  config,
}: PortfolioPositionsDataParams) => {
  const vaultData = vaultsList.find((vault) => vault.id === position.pool.id.fleetAddress.value)

  if (!vaultData) {
    throw new Error(`Vault not found for position ${position.pool.id.fleetAddress.value}`)
  }
  const [vaultWithInterestRates] = decorateCustomVaultFields(
    [vaultData],
    config,
    await getInterestRates({
      network: vaultData.protocol.network,
      arksList: vaultData.arks,
    }),
  )

  return {
    positionData: position,
    vaultData: vaultWithInterestRates,
  }
}

export type PortfolioPositionsList = Awaited<ReturnType<typeof portfolioPositionsHandler>>
