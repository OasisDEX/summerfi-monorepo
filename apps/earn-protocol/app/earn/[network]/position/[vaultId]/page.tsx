import { Text } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'

import { getVaultDetails } from '@/app/server-handlers/sdk/getVaultDetails'
import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'

type EarnVaultOpenManagePageProps = {
  params: {
    vaultId: string
    network: SDKNetwork
  }
}

export const revalidate = 60

const EarnVaultOpenManagePage = async ({ params }: EarnVaultOpenManagePageProps) => {
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

export default EarnVaultOpenManagePage
