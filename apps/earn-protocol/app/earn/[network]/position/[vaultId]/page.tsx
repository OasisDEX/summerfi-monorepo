import { Text } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'

import { getUserActivity } from '@/app/server-handlers/sdk/get-user-activity'
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
  const [vault, { vaults }, { userActivity, topDepositors }] = await Promise.all([
    getVaultDetails({
      vaultAddress: params.vaultId,
      network: params.network,
    }),
    getVaultsList(),
    getUserActivity({ vaultAddress: params.vaultId, network: params.network }),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {params.vaultId} on the network {params.network}
      </Text>
    )
  }

  return (
    <VaultOpenView
      vault={vault}
      vaults={vaults}
      userActivity={userActivity}
      topDepositors={topDepositors}
    />
  )
}

export default EarnVaultOpenPage
