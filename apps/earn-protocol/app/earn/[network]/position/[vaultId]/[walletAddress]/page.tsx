import { Text } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client-react'

import { getUserPosition } from '@/app/server-handlers/sdk/get-user-position'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { VaultManageView } from '@/components/layout/VaultManageView/VaultManageView'

type EarnVaultManagePageProps = {
  params: {
    vaultId: string
    network: SDKNetwork
    walletAddress: string
  }
}

export const revalidate = 60

const EarnVaultManagePage = async ({ params }: EarnVaultManagePageProps) => {
  const [vault, { vaults }, position] = await Promise.all([
    getVaultDetails({
      vaultAddress: params.vaultId,
      network: params.network,
    }),
    getVaultsList(),
    getUserPosition({
      vaultAddress: params.vaultId,
      network: params.network,
      walletAddress: params.walletAddress,
    }),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {params.vaultId} on the network {params.network}
      </Text>
    )
  }

  if (!position) {
    return (
      <Text>
        No position found on {params.walletAddress} on the network {params.network}
      </Text>
    )
  }

  const positionJsonSafe = parseServerResponseToClient<IArmadaPosition>(position)

  return (
    <VaultManageView
      vault={vault}
      vaults={vaults}
      position={positionJsonSafe}
      viewWalletAddress={params.walletAddress}
    />
  )
}

export default EarnVaultManagePage
