import { Text, VaultGridDetails } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'
import { isAddress } from '@summerfi/sdk-common'
import { redirect } from 'next/navigation'

import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultDetailsView } from '@/components/layout/VaultDetailsView/VaultDetailsView'
import { isFullyLaunched } from '@/constants/is-fully-launched'
import {
  decorateCustomVaultFields,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultDetailsPageProps = {
  params: {
    network: SDKNetwork
    vaultId: string
  }
}

export const revalidate = 60

const EarnVaultDetailsPage = async ({ params }: EarnVaultDetailsPageProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!isFullyLaunched) {
    return redirect('/sumr')
  }
  const parsedNetwork = humanNetworktoSDKNetwork(params.network)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const { config: systemConfig } = parseServerResponseToClient(await systemConfigHandler())

  const parsedVaultId = isAddress(params.vaultId)
    ? params.vaultId
    : getVaultIdByVaultCustomName(params.vaultId, String(parsedNetworkId), systemConfig)

  const [vault, { vaults }] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getVaultsList(),
  ])

  const vaultsDecorated = decorateCustomVaultFields({ vaults, systemConfig })

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  return (
    <VaultGridDetails vault={vault} vaults={vaultsDecorated}>
      <VaultDetailsView />
    </VaultGridDetails>
  )
}

export default EarnVaultDetailsPage
