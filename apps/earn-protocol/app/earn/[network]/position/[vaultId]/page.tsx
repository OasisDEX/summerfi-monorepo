import { Text } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'

import { getRebalances } from '@/app/server-handlers/sdk/getRebalances'
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
  const [vault, { vaults }, { rebalances }] = await Promise.all([
    getVaultDetails({
      vaultAddress: params.vaultId,
      network: params.network,
    }),
    getVaultsList(),
    getRebalances(),
  ])

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
