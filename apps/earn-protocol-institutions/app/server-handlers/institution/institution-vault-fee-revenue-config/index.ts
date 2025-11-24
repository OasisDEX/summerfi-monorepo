import { type SupportedSDKNetworks } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, ArmadaVaultId, getChainInfoByChainId } from '@summerfi/sdk-common'

import { getInstitutionsSDK } from '@/app/server-handlers/sdk'

export const getInstitutionVaultFeeRevenueConfig = async ({
  network,
  institutionName,
  vaultAddress,
}: {
  institutionName: string
  network: SupportedSDKNetworks
  vaultAddress: string
}) => {
  if (!institutionName) return null
  if (typeof institutionName !== 'string') return null

  try {
    const chainId = subgraphNetworkToId(network)

    const institutionSdk = getInstitutionsSDK(institutionName)
    const vaultId = ArmadaVaultId.createFrom({
      chainInfo: getChainInfoByChainId(chainId),
      fleetAddress: Address.createFromEthereum({
        value: vaultAddress,
      }),
    })

    return await institutionSdk.armada.admin.getFeeRevenueConfig({
      vaultId,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching institution vault fee revenue config:', error)

    return null
  }
}
