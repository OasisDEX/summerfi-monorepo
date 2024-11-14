import { Text } from '@summerfi/app-earn-ui'
import { humanNetworktoSDKNetwork, type SDKNetwork } from '@summerfi/app-types'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client-react'

import { getUserActivity } from '@/app/server-handlers/sdk/get-user-activity'
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
  const parsedNetwork = humanNetworktoSDKNetwork(params.network)
  const [vault, { vaults }, position, { userActivity, topDepositors }] = await Promise.all([
    getVaultDetails({
      vaultAddress: params.vaultId,
      network: parsedNetwork,
    }),
    getVaultsList(),
    getUserPosition({
      vaultAddress: params.vaultId,
      network: parsedNetwork,
      walletAddress: params.walletAddress,
    }),
    getUserActivity({
      vaultAddress: params.vaultId,
      network: parsedNetwork,
      walletAddress: params.walletAddress,
    }),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {params.vaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  if (!position) {
    return (
      <Text>
        No position found on {params.walletAddress} on the network {parsedNetwork}
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
      userActivity={userActivity}
      topDepositors={topDepositors}
    />
  )
}

export default EarnVaultManagePage
