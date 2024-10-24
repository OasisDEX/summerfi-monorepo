import { type SDKNetwork } from '@summerfi/app-types'

import { StrategiesListView } from '@/components/layout/StrategiesListView/StrategiesListView'
import { getVaultsList } from '@/server-handlers/sdk/getVaultsList'

type EarnNetworkStrategiesPageProps = {
  params: {
    network: SDKNetwork | 'all-networks'
  }
}

const EarnNetworkStrategiesPage = async ({ params }: EarnNetworkStrategiesPageProps) => {
  const strategiesList = await getVaultsList()

  return <StrategiesListView strategiesList={strategiesList} selectedNetwork={params.network} />
}

export default EarnNetworkStrategiesPage
