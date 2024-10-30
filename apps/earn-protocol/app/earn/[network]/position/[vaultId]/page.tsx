import { Text } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'

import { getRebalances } from '@/app/server-handlers/sdk/get-rebalances'
import { getUserPosition } from '@/app/server-handlers/sdk/get-user-position'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'

type EarnVaultOpenManagePageProps = {
  params: {
    vaultId: string
    network: SDKNetwork
  }
}

export const revalidate = 60

const EarnVaultOpenManagePage = async ({ params }: EarnVaultOpenManagePageProps) => {
  const [vault, { vaults }, { rebalances }, position] = await Promise.all([
    getVaultDetails({
      vaultAddress: params.vaultId,
      network: params.network,
    }),
    getVaultsList(),
    getRebalances(),
    getUserPosition(),
  ])

  console.log('position', JSON.stringify(position, null, 2))

  if (!vault) {
    return (
      <Text>
        No vault found with the id {params.vaultId} on the network {params.network}
      </Text>
    )
  }

  return <VaultOpenView vault={vault} vaults={vaults} rebalances={rebalances} />
}

export default EarnVaultOpenManagePage
