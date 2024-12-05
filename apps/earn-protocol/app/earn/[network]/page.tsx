import { type SDKNetwork } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork, parseServerResponseToClient } from '@summerfi/app-utils'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultsListView } from '@/components/layout/VaultsListView/VaultsListView'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

type EarnNetworkVaultsPageProps = {
  params: {
    network: SDKNetwork | 'all-networks'
  }
}

export const revalidate = 60

const EarnNetworkVaultsPage = async ({ params }: EarnNetworkVaultsPageProps) => {
  const parsedNetwork = humanNetworktoSDKNetwork(params.network)
  const { vaults } = await getVaultsList()
  const { config } = parseServerResponseToClient(await systemConfigHandler())
  const vaultsDecorated = decorateCustomVaultFields(vaults, config)

  return <VaultsListView vaultsList={vaultsDecorated} selectedNetwork={parsedNetwork} />
}

export default EarnNetworkVaultsPage
