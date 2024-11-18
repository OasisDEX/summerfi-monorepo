import { Text, VaultGridDetails } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { VaultDetailsView } from '@/components/layout/VaultDetailsView/VaultDetailsView'

type EarnVaultDetailsPageProps = {
  params: {
    network: SDKNetwork
    vaultId: string
  }
}

export const revalidate = 60

const EarnVaultDetailsPage = async ({ params }: EarnVaultDetailsPageProps) => {
  const parsedNetwork = humanNetworktoSDKNetwork(params.network)
  const [vault, { vaults }] = await Promise.all([
    getVaultDetails({
      vaultAddress: params.vaultId,
      network: parsedNetwork,
    }),
    getVaultsList(),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {params.vaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  return (
    <VaultGridDetails vault={vault} vaults={vaults}>
      <VaultDetailsView />
    </VaultGridDetails>
  )
}

export default EarnVaultDetailsPage
