import { type EarnAppConfigType, type SDKVaultsListType } from '@summerfi/app-types'
import { subgraphNetworkToSDKId } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client'

import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { getPositionHistory } from '@/app/server-handlers/position-history'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

export type PortfolioPositionsDataParams = {
  position: IArmadaPosition
  vaultsList: SDKVaultsListType // not vaultish, this is the list, not the vault "details"
  config: Partial<EarnAppConfigType>
  walletAddress: string
}

// since we dont have vault details on the positions list
// we need to merge the vault details with the position
export const portfolioPositionsHandler = async ({
  position,
  vaultsList,
  config,
  walletAddress,
}: PortfolioPositionsDataParams) => {
  const vaultData = vaultsList.find(
    (vault) =>
      vault.id === position.pool.id.fleetAddress.value &&
      subgraphNetworkToSDKId(vault.protocol.network) === position.id.user.chainInfo.chainId,
  )

  if (!vaultData) {
    throw new Error(`Vault not found for position ${position.pool.id.fleetAddress.value}`)
  }
  const [interestRates, positionHistory] = await Promise.all([
    await getInterestRates({
      network: vaultData.protocol.network,
      arksList: vaultData.arks,
    }),
    await getPositionHistory({
      network: vaultData.protocol.network,
      address: walletAddress.toLowerCase(),
      vault: vaultData,
    }),
  ])

  const [vaultWithInterestRates] = decorateCustomVaultFields({
    vaults: [vaultData],
    systemConfig: config,
    position,
    decorators: {
      arkInterestRatesMap: interestRates,
      positionHistory,
    },
  })

  return {
    positionData: position,
    vaultData: vaultWithInterestRates,
  }
}

export type PortfolioPositionsList = Awaited<ReturnType<typeof portfolioPositionsHandler>>
