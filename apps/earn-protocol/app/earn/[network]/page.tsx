import { type SDKNetwork } from '@summerfi/app-types'

import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { VaultsListView } from '@/components/layout/VaultsListView/VaultsListView'

type EarnNetworkVaultsPageProps = {
  params: {
    network: SDKNetwork | 'all-networks'
  }
}

export const revalidate = 60

const EarnNetworkVaultsPage = async ({ params }: EarnNetworkVaultsPageProps) => {
  const { vaults } = await getVaultsList()

  return <VaultsListView vaultsList={vaults} selectedNetwork={params.network} />
}

export default EarnNetworkVaultsPage
