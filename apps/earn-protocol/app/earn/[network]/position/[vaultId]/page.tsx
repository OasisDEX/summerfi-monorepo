import { Text } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'

import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'

type EarnVaultOpenPageProps = {
  params: {
    vaultId: string
    network: SDKNetwork
  }
}

export const revalidate = 60

const EarnVaultOpenPage = async ({ params }: EarnVaultOpenPageProps) => {
  const [vault, { vaults }] = await Promise.all([
    getVaultDetails({
      vaultAddress: params.vaultId,
      network: params.network,
    }),
    getVaultsList(),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {params.vaultId} on the network {params.network}
      </Text>
    )
  }

  return <VaultOpenView vault={vault} vaults={vaults} />
}

export default EarnVaultOpenPage
