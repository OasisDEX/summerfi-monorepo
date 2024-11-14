import { type SDKNetwork } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { VaultsListView } from '@/components/layout/VaultsListView/VaultsListView'

type EarnNetworkVaultsPageProps = {
  params: {
    network: SDKNetwork | 'all-networks'
  }
}

export const revalidate = 60

const EarnNetworkVaultsPage = async ({ params }: EarnNetworkVaultsPageProps) => {
  const parsedNetwork = humanNetworktoSDKNetwork(params.network)
  const { vaults } = await getVaultsList()

  return <VaultsListView vaultsList={vaults} selectedNetwork={parsedNetwork} />
}

export default EarnNetworkVaultsPage
