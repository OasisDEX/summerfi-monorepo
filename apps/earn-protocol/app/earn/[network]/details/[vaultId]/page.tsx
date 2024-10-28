import { subgraphNetworkToId, VaultGridDetails } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'

import { getVaultDetails } from '@/app/server-handlers/sdk/getVaultDetails'
import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { VaultDetailsView } from '@/components/layout/VaultDetailsView/VaultDetailsView'

type EarnVaultDetailsPageProps = {
  params: {
    network: SDKNetwork
    vaultId: string
  }
}

export const revalidate = 60

const EarnVaultDetailsPage = async ({ params }: EarnVaultDetailsPageProps) => {
  const networkId = subgraphNetworkToId(params.network)

  const [selectedVault, { vaults }] = await Promise.all([
    getVaultDetails({
      vaultAddress: params.vaultId,
      chainId: networkId,
    }),
    getVaultsList(),
  ])

  return (
    <VaultGridDetails vault={selectedVault} vaults={vaults}>
      <VaultDetailsView />
    </VaultGridDetails>
  )
}

export default EarnVaultDetailsPage
